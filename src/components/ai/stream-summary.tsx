"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { StreamSummary as StreamSummaryType } from "@/src/types/stream";

type Props = {
  streamId: string;
  streamTitle: string;
  streamDescription: string;
  initialSummary?: any; // Can be StreamSummaryType object, stringified JSON, or null
};

export default function StreamSummary({
  streamId,
  streamTitle,
  streamDescription,
  initialSummary,
}: Props) {
  const [summary, setSummary] = useState<StreamSummaryType | null>(() => {
    if (!initialSummary) return null;
    if (typeof initialSummary === "object") {
      // Ensure all fields exist in object
      return {
        title: initialSummary.title || streamTitle,
        summary: initialSummary.summary || "",
        topics: initialSummary.topics || [],
        highlights: initialSummary.highlights || [],
        difficulty: initialSummary.difficulty || "Intermediate",
      };
    }
    try {
      const clean = initialSummary
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const parsed = JSON.parse(clean);
      return {
        title: parsed.title || streamTitle,
        summary: parsed.summary || "",
        topics: parsed.topics || [],
        highlights: parsed.highlights || [],
        difficulty: parsed.difficulty || "Intermediate",
      };
    } catch (e) {
      return {
        title: streamTitle,
        summary: initialSummary,
        topics: [],
        highlights: [],
        difficulty: "Intermediate",
      };
    }
  });

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
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

      if (res.ok) {
        const data = await res.json();
        const bedrockResponse = data.summary || "";

        // 6. JSON parse safely karo:
        try {
          const clean = bedrockResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          const parsed = JSON.parse(clean);
          setSummary(parsed);
        } catch (e) {
          // fallback: plain text as summary
          setSummary({
            title: streamTitle,
            summary: bedrockResponse,
            topics: [],
            highlights: [],
            difficulty: "Intermediate",
          });
        }
      } else {
        console.error("Failed to generate summary");
      }
    } catch (err) {
      console.error("Failed to generate summary:", err);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (!summary) return;
    const text = `
${summary.title}

${summary.summary}

Topics: ${summary.topics?.join(", ") || ""}

Highlights:
${summary.highlights?.map((h) => `• ${h}`).join("\n") || ""}

Difficulty: ${summary.difficulty}
    `.trim();
    
    navigator.clipboard.writeText(text);
    // Button text 2 seconds ke liye "Copied!" ho jaye phir wapas "Copy"
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for topic colors
  const getTopicColors = (topic: string) => {
    const lower = topic.toLowerCase();
    if (lower === "react") {
      return { bg: "rgba(56, 189, 248, 0.15)", text: "#38BDF8", border: "rgba(56, 189, 248, 0.3)" }; // blue
    }
    if (lower === "go" || lower === "python") {
      return { bg: "rgba(52, 211, 153, 0.15)", text: "#34D399", border: "rgba(52, 211, 153, 0.3)" }; // green
    }
    if (lower === "rust") {
      return { bg: "rgba(251, 146, 60, 0.15)", text: "#FB923C", border: "rgba(251, 146, 60, 0.3)" }; // orange
    }
    if (lower === "aws") {
      return { bg: "rgba(251, 191, 36, 0.15)", text: "#FBBF24", border: "rgba(251, 191, 36, 0.3)" }; // yellow
    }
    // default violet
    return { bg: "rgba(124, 58, 237, 0.15)", text: "#C084FC", border: "rgba(124, 58, 237, 0.3)" };
  };

  if (loading) {
    // 3. Loading state
    return (
      <div style={{padding: "20px", background: "#0F0F1A", border: "1px solid #1E1E3A", borderRadius: "8px"}}>
        <div style={{display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px"}}>
          <div style={{width: "8px", height: "8px", borderRadius: "50%", background: "#7C3AED", animation: "pulse 1.5s infinite"}} />
          <span style={{fontSize: "11px", fontFamily: "JetBrains Mono, monospace", color: "#4A4870"}}>
            Generating summary with AI...
          </span>
        </div>
        {/* 3 skeleton bars */}
        <div style={{height: "12px", background: "#16162A", borderRadius: "4px", marginBottom: "8px", width: "100%"}} />
        <div style={{height: "12px", background: "#16162A", borderRadius: "4px", marginBottom: "8px", width: "80%"}} />
        <div style={{height: "12px", background: "#16162A", borderRadius: "4px", width: "60%"}} />
      </div>
    );
  }

  if (!summary) {
    return (
      <div
        style={{
          background: "#0F0F1A",
          border: "1px solid #1E1E3A",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "16px",
        }}
        className="flex flex-col items-center justify-center text-center space-y-4"
      >
        <p className="text-sm text-[#4A4870] font-medium">AI stream summary is not yet generated for this session.</p>
        <button
          onClick={handleGenerate}
          className="text-xs px-4 py-2 rounded bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold transition-all cursor-pointer hover:-translate-y-0.5"
        >
          Generate Summary
        </button>
      </div>
    );
  }

  return (
    // 2. Summary UI Card style
    <div
      style={{
        background: "#0F0F1A",
        border: "1px solid #1E1E3A",
        borderRadius: "8px",
        padding: "20px",
        marginTop: "16px",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            background: "rgba(124, 58, 237, 0.15)",
            color: "#C084FC",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            padding: "2px 8px",
            borderRadius: "4px",
            fontWeight: "bold",
            letterSpacing: "0.05em",
          }}
        >
          AI SUMMARY
        </span>
        <span style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF", textAlign: "right" }}>
          {summary.title}
        </span>
      </div>

      {/* Divider line */}
      <div style={{ height: "1px", background: "#1E1E3A", margin: "16px 0" }} />

      {/* Summary paragraph */}
      <p
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "14px",
          color: "#9E9E9E",
          lineHeight: "1.7",
        }}
      >
        {summary.summary}
      </p>

      {/* Key Topics row */}
      {summary.topics && summary.topics.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
          {summary.topics.map((topic, index) => {
            const colors = getTopicColors(topic);
            return (
              <span
                key={index}
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  backgroundColor: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {topic}
              </span>
            );
          })}
        </div>
      )}

      {/* Highlights section */}
      {summary.highlights && summary.highlights.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <ul style={{ display: "flex", flexDirection: "column", gap: "10px", padding: 0, margin: 0, listStyle: "none" }}>
            {summary.highlights.map((highlight, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  color: "#9E9E9E",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                <Check size={14} className="text-[#7C3AED] shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Divider line */}
      <div style={{ height: "1px", background: "#1E1E3A", margin: "16px 0" }} />

      {/* Bottom row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: "600",
            padding: "4px 10px",
            borderRadius: "6px",
            border: "1px solid #1E1E3A",
            background: "#16162A",
            color: "#9E9E9E",
          }}
        >
          {summary.difficulty}
        </span>

        <button
          onClick={copyToClipboard}
          style={{
            fontSize: "12px",
            fontWeight: "600",
            padding: "6px 14px",
            borderRadius: "6px",
            backgroundColor: "#7C3AED",
            color: "#FFFFFF",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          className="hover:bg-[#6D28D9] active:bg-[#5B21B6] transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}