import React from "react";

export function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-red-950 text-live-red border border-red-800 h-5 px-2 rounded-full">
      <div className="relative flex h-2 w-2">
        <span className="animate-[live-pulse_1.5s_infinite] absolute inline-flex h-full w-full rounded-full bg-live-pulse opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-live-red"></span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest font-semibold mt-[1px]">LIVE</span>
    </div>
  );
}
