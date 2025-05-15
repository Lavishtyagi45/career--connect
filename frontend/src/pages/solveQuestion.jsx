import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SolveQuestion = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python3");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/practice/questions/${id}`)
      .then((res) => setQuestion(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    if (!code.trim()) {
      alert("Code cannot be empty!");
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting code with:", { code, language });
      const res = await axiosInstance.post(`/practice/submit/${id}`, {
        code,
        language,
      });
      setResults(res.data.results);
    } catch (err) {
      console.error("Submission error:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  if (!question) return <div className="p-6">Loading...</div>;

  const passedCount = results?.filter((r) => r.passed).length || 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
      <p className="mb-4">{question.description}</p>
      <select
        className="mb-2 border p-1"
        onChange={(e) => setLanguage(e.target.value)}
        value={language}
      >
        <option value="python3">Python 3</option>
        <option value="javascript">JavaScript</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <textarea
        className="w-full border p-2 h-48 font-mono mb-4"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {results && (
        <>
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">
              Results ({passedCount}/{results.length} Passed)
            </h2>
            <ul className="list-disc ml-5 space-y-2">
              {results.map((r, i) => (
                <li
                  key={i}
                  className={r.passed ? "text-green-600" : "text-red-600"}
                >
                  <strong>Test Case {i + 1}:</strong>
                  <br />
                  Status: {r.passed ? "Passed ✅" : "Failed ❌"}
                  <br />
                  Input: <code>{r.input}</code>
                  <br />
                  Expected: <code>{r.expected}</code>
                  <br />
                  Actual: <code>{r.actual}</code>
                  <br />
                  Time: {r.time}s, Memory: {r.memory}KB
                  <br />
                  {r.error && (
                    <div className="text-red-500 mt-1">
                      <strong>Error:</strong>{" "}
                      <pre className="whitespace-pre-wrap">{r.error}</pre>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Performance Summary</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={results.map((r, i) => ({
                  name: `Case ${i + 1}`,
                  time: parseFloat(r.time) || 0,
                  memory: parseFloat(r.memory) || 0,
                }))}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="time" fill="#8884d8" name="Time (s)" />
                <Bar dataKey="memory" fill="#82ca9d" name="Memory (KB)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default SolveQuestion;
