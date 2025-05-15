import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";

const PracticePage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("dsa");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/practice/questions?domain=${selectedDomain}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setQuestions(data);
      })
      .catch((err) => {
        console.error(err);
        setQuestions([]);
      })
      .finally(() => setLoading(false));
  }, [selectedDomain]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Practice Questions</h1>

      <select
        className="mb-4 p-2 border rounded"
        onChange={(e) => setSelectedDomain(e.target.value)}
        value={selectedDomain}
      >
        <option value="dsa">DSA</option>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
      </select>

      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <ul className="space-y-4">
          {questions.length === 0 ? (
            <li className="p-4 bg-white shadow rounded">No questions found</li>
          ) : (
            questions.map((q) => (
              <li key={q._id} className="p-4 bg-white shadow rounded">
                <h2 className="text-lg font-semibold">{q.title}</h2>
                <p className="text-sm text-gray-600">{q.description}</p>
                <div className=" flex justify-between">
                  <Link
                    to={`/practice/${q._id}`}
                    className="bg-blue-600 text-white rounded-md mt-2 p-1.5 inline-block"
                  >
                    Solve
                  </Link>
                  <div>
                    <button className="text-sm text-white p-1.5 bg-purple-700 mr-2 rounded-md cursor-default">
                      {q.difficulty}
                    </button>
                    <button className="text-sm text-white p-1.5 bg-green-700 rounded-md cursor-default">
                      {q.domain}
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default PracticePage;
