"use client";

import { useState } from "react";

type Props = {
  streamTitle: string;
  streamDescription: string;
};

export default function AIAssistant({
  streamTitle,
  streamDescription,

}: Props) {
  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {

    alert(

      JSON.stringify({

        question,

        code,

        streamTitle,

        streamDescription,

      })

    );


    setLoading(true);



    const res = await fetch("/api/ai", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify({

        question,

        code,

        streamTitle,

        streamDescription,

      }),

    });

    console.log("Status:", res.status);

    const data = await res.json();

    console.log("Response:", data);

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

      <textarea

        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste code here..."
        className="w-full border p-3 rounded mt-4 h-48"

      />
      <button onClick={handleAsk} className="mt-4 border px-4 py-2 rounded">
        {loading ? "Thinking..." : "Ask AI"}
      </button>
      {response && <div className="mt-6 border rounded p-4">{response}</div>}
    </div>
  );
}
