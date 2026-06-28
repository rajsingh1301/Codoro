import React from "react";

interface ViewerCountProps {
  count: number;
}

export function formatViewerCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k";
  }
  return count.toString();
}

export function ViewerCount({ count }: ViewerCountProps) {
  return (
    <div className="flex items-center gap-1.5 text-text-secondary font-mono text-[11px] font-medium">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3.5 h-3.5"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>{formatViewerCount(count)} watching</span>
    </div>
  );
}
