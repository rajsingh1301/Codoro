"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  X, 
  FileText, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw
} from "lucide-react";
import { StreamSummary as StreamSummaryType } from "@/src/types/stream";

type Props = {
  streamTitle: string;
  streamDescription: string;
};

export default function StreamSummaryDrawer({
  streamTitle,
  streamDescription,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState<StreamSummaryType | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setFeedback(null);
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
        alert("Failed to generate summary from AI engine.");
      }
    } catch (err) {
      console.error("Failed to generate summary:", err);
      alert("Network error: Failed to connect to AI engine.");
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    if (typeof window !== "undefined" && summary) {
      const text = `
${summary.title}

${summary.summary}

Topics: ${summary.topics?.join(", ") || ""}

Highlights:
${summary.highlights?.map((h) => `• ${h}`).join("\n") || ""}

Difficulty: ${summary.difficulty}
      `.trim();
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* TRIGGER BUTTON (Collapsed State) */}
      <button
        onClick={() => setIsOpen(true)}
        className="h-10 w-10 flex items-center justify-center bg-[#171717] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] text-[#9E9E9E] hover:text-white rounded-xl transition-all cursor-pointer shadow-sm relative group hover:-translate-y-0.5"
      >
        <Sparkles size={16} className="text-[#6366F1]" />
        
        {/* Active Indicator Dot */}
        {summary && (
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#6366F1] rounded-full" />
        )}

        {/* Custom Tooltip */}
        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#111111] border border-[rgba(255,255,255,0.08)] text-[10px] text-[#9E9E9E] rounded px-2 py-1 whitespace-nowrap shadow-md z-50">
          AI Summary
        </div>
      </button>

      {/* BACKDROP OVERLAY */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* EXPANDABLE PANEL (Drawer / Bottom Sheet) */}
      <div
        className={`fixed z-50 bg-[#111111] border-[rgba(255,255,255,0.08)] shadow-2xl transition-transform duration-300 flex flex-col
          bottom-0 left-0 w-full h-[80vh] border-t rounded-t-3xl md:top-0 md:right-0 md:left-auto md:w-[420px] md:h-full md:border-l md:border-t-0 md:rounded-t-none
          ${isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full md:translate-y-0"}
        `}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#6366F1]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-sans">AI Stream Summary</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[#171717] text-[#9E9E9E] hover:text-white transition-colors cursor-pointer"
            aria-label="Close Summary Panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            /* LOADING STATE */
            <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Synthesizing stream contents</p>
                <p className="text-xs text-[#9E9E9E]">Analyzing transcripts and generated details...</p>
              </div>
            </div>
          ) : !summary ? (
            /* EMPTY STATE */
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-6">
              <div className="p-4 bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl">
                <FileText size={32} className="text-[#5C5C5C]" />
              </div>
              <div className="space-y-2 max-w-xs">
                <h3 className="text-sm font-bold text-white">No summary yet</h3>
                <p className="text-xs text-[#9E9E9E] leading-relaxed">
                  Generate a summary to get key highlights and important points from this stream.
                </p>
              </div>
              <button
                onClick={handleGenerate}
                className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-xs transition-all shadow-sm cursor-pointer hover:-translate-y-0.5 gap-1.5"
              >
                <Sparkles size={14} /> Generate Summary
              </button>
            </div>
          ) : (
            /* SUMMARY OUTPUT STATE */
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9E9E9E]">Summary</h3>
                  <span className="text-[10px] text-[#5C5C5C] font-mono">Generated just now</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="h-8 px-3 inline-flex items-center justify-center rounded-lg bg-[#171717] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] text-[#9E9E9E] hover:text-white text-xs font-medium transition-all gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-[#4ADE80]" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy
                    </>
                  )}
                </button>
              </div>

              {/* Summary Text Content Box */}
              <div className="p-5 bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl space-y-4">
                {summary.title && (
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {summary.title}
                  </h4>
                )}
                
                <p className="text-xs text-[#9E9E9E] leading-relaxed">
                  {summary.summary}
                </p>

                {summary.topics && summary.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {summary.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#6366F1]/10 text-[#A78BFA] border border-[#6366F1]/20 font-sans"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {summary.highlights && summary.highlights.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[rgba(255,255,255,0.04)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C5C5C]">
                      Highlights
                    </span>
                    <ul className="space-y-1.5">
                      {summary.highlights.map((highlight, i) => (
                        <li key={i} className="text-xs text-[#9E9E9E] flex items-start gap-2">
                          <Check size={12} className="text-[#6366F1] shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.04)]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C5C5C]">
                    Difficulty
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.08)] bg-[#111111] text-[#9E9E9E] font-semibold">
                    {summary.difficulty}
                  </span>
                </div>
              </div>

              {/* Feedback and Regeneration Area */}
              <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.08)] text-xs text-[#9E9E9E]">
                <span>Was this helpful?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFeedback("up")}
                    className={`h-7 w-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer border ${
                      feedback === "up" 
                        ? "bg-[#6366F1]/10 border-[#6366F1] text-[#6366F1]" 
                        : "bg-[#171717] border-[rgba(255,255,255,0.08)] hover:text-white"
                    }`}
                  >
                    <ThumbsUp size={12} />
                  </button>
                  <button
                    onClick={() => setFeedback("down")}
                    className={`h-7 w-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer border ${
                      feedback === "down" 
                        ? "bg-rose-500/10 border-rose-500 text-rose-500" 
                        : "bg-[#171717] border-[rgba(255,255,255,0.08)] hover:text-white"
                    }`}
                  >
                    <ThumbsDown size={12} />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGenerate}
                  className="w-full h-10 inline-flex items-center justify-center rounded-lg bg-[#171717] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] text-[#9E9E9E] hover:text-white text-xs font-semibold transition-all gap-1.5 cursor-pointer hover:-translate-y-0.5"
                >
                  <RefreshCw size={12} /> Regenerate Summary
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
