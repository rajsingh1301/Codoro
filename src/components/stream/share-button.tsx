"use client";

import React from "react";
import { Share2 } from "lucide-react";

export default function ShareButton() {
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Stream URL copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="h-10 w-10 flex items-center justify-center bg-[#171717] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] text-[#9E9E9E] hover:text-white rounded-xl transition-all cursor-pointer shadow-sm self-start sm:self-center shrink-0"
      title="Share Stream"
    >
      <Share2 size={16} />
    </button>
  );
}
