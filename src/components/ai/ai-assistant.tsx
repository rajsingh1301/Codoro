"use client";

import { useState } from "react";

export default function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    setLoading(true);

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    });

    const data = await res.json();

    setResponse(data.response);
    setLoading(false);
  }

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">AI Coding Assistant</h2>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything..."
        className="w-full border p-3 rounded"
      />

      <button onClick={handleAsk} className="mt-4 border px-4 py-2 rounded">
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {response && <div className="mt-6 border rounded p-4">{response}</div>}
    </div>
  );
}
