"use client";

import React from "react";
import Link from "next/link";
import { ThumbsUp, Plus, Info } from "lucide-react";

export default function FloatingActionPill() {
  const handleLike = () => {
    alert("Stream liked!");
  };

  const handleInfo = () => {
    alert("CodeLive: Secure stream session powered by AWS IVS & AI review engine.");
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111111]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-full py-2.5 px-6 shadow-2xl flex items-center gap-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button 
        onClick={handleLike}
        className="flex items-center gap-2 text-xs font-semibold text-[#9E9E9E] hover:text-white transition-colors cursor-pointer"
      >
        <ThumbsUp size={15} className="text-[#6366F1]" />
        <span>Like</span>
      </button>
      
      <div className="h-4 w-px bg-[rgba(255,255,255,0.08)]" />
      
      <Link 
        href="/communities"
        className="flex items-center gap-2 text-xs font-semibold text-[#9E9E9E] hover:text-white transition-colors cursor-pointer"
      >
        <Plus size={15} className="text-[#6366F1]" />
        <span>Follow Circle</span>
      </Link>
      
      <div className="h-4 w-px bg-[rgba(255,255,255,0.08)]" />
      
      <button 
        onClick={handleInfo}
        className="flex items-center gap-2 text-xs font-semibold text-[#9E9E9E] hover:text-white transition-colors cursor-pointer"
      >
        <Info size={15} className="text-[#6366F1]" />
        <span>Info & Safety</span>
      </button>
    </div>
  );
}
