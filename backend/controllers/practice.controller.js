import Question from "../models/question.model.js";
import Submission from "../models/submission.model.js"; // New
import axios from "axios";
import { languageMap } from "../libs/languageMap.js";

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions";
const API_HEADERS = {
  "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "Content-Type": "application/json",
};

export const getQuestionsByDomain = async (req, res) => {
  const { domain } = req.query;
  try {
    const query = domain
      ? { domain: { $regex: new RegExp(`^${domain}$`, "i") } } // case-insensitive
      : {};

    const questions = await Question.find(query);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const submitCode = async (req, res) => {
  const { id } = req.params;
  const { code, language } = req.body;
  const languageId = languageMap[language];

  console.log("Received language:", language);
  console.log("Resolved languageId:", languageId);
  console.log("Received code:", code?.slice(0, 30)); // Print a preview

  if (!languageId) {
    return res.status(400).json({ message: "Invalid or unsupported language" });
  }
  if (!code || typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ message: "Code cannot be empty" });
  }

  try {
    const question = await Question.findById(id);
    if (!question || question.testCases.length === 0) {
      return res
        .status(404)
        .json({ message: "Question or test cases not found" });
    }

    const submissions = question.testCases.map((test) => ({
      source_code: code?.trim() || "",
      language_id: Number(languageId),
      stdin: test.input || "",
    }));

    // Defensive validation
    if (
      !Array.isArray(submissions) ||
      submissions.length === 0 ||
      submissions.some((sub) => !sub.source_code || !sub.language_id)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or missing submission fields." });
    }

    // Send batch to Judge0
    const response = await axios.post(
      `${JUDGE0_API}/batch?base64_encoded=false`,
      { submissions },
      { headers: API_HEADERS }
    );

    console.log("Judge0 response:", response.data);

    const tokens = response.data.map((item)=> item.token);
    if (!tokens || tokens.length === 0) {
      return res
        .status(500)
        .json({
          message: "Failed to get tokens from Judge0 API",
          details: response.data,
        });
    }

    const pollSubmissions = async (retryCount = 0) => {
      const { data } = await axios.get(
        `${JUDGE0_API}/batch?tokens=${tokens.join(",")}&base64_encoded=false`,
        { headers: API_HEADERS }
      );
      const completed = data.submissions.every((sub) => sub.status.id >= 3);
      if (completed || retryCount >= 10) return data.submissions;
      return new Promise((resolve) =>
        setTimeout(() => resolve(pollSubmissions(retryCount + 1)), 1000)
      );
    };

    const resultsData = await pollSubmissions();
    const normalize = (str) => (str || "").replace(/\r/g, "").trim();

    const results = resultsData.map((submission, i) => {
      const test = question.testCases[i];
      const expected = normalize(test.output);
      const actual = normalize(submission.stdout);
      return {
        input: test.input,
        expected,
        actual,
        passed: expected === actual,
        time: submission.time,
        memory: submission.memory,
        error: submission.stderr || submission.compile_output || null,
      };
    });

    const passedCount = results.filter((r) => r.passed).length;

    await Submission.create({
      userId: req.user?.id || null,
      questionId: id,
      code,
      language,
      results,
      passedCount,
      totalCount: results.length,
    });

    res.json({ results });
  } catch (err) {
    console.error("Submission error:", err?.response?.data || err.message);
    res.status(500).json({ message: "Error submitting code" });
  }
};

export const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const submissions = await Submission.find({ userId })
      .populate("questionId", "title")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching submissions" });
  }
};
