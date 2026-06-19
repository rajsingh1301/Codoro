"use client";

import { useState } from "react";

type Props = {
  streamTitle: string;
  streamDescription: string;
};

export default function StreamSummary({
  streamTitle,
  streamDescription,
}: Props) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);

    const res = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        streamTitle,
        streamDescription,
      }),
    });

    const data = await res.json();

    setSummary(data.summary);

    setLoading(false);
  }

  return (
    <div className="border rounded-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">
        AI Stream Summary
      </h2>

      <button
        onClick={handleGenerate}
        className="border px-4 py-2 rounded"
      >
        {loading
          ? "Generating..."
          : "Generate Summary"}
      </button>

      {summary && (
        <div className="mt-4 whitespace-pre-wrap">
          {summary}
        </div>
      )}
    </div>
  );
}
