"use client";

import React, { useEffect, useState, useRef } from "react";
import IVSPlayer from "./ivs-player";

type Props = {
  streamId: string;
  playbackUrl: string;
  initialStatus: "OFFLINE" | "LIVE" | "ENDED";
};

export default function StreamPlayerWrapper({
  streamId,
  playbackUrl,
  initialStatus,
}: Props) {
  const [status, setStatus] = useState<"OFFLINE" | "LIVE" | "ENDED" | "LOADING">("LOADING");
  const [health, setHealth] = useState<"LIVE" | "OFFLINE" | "BUFFERING" | "CONNECTING">("OFFLINE");
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Poll for status updates
  useEffect(() => {
    let active = true;

    async function checkStatus() {
      try {
        const res = await fetch(`/api/stream-status/${streamId}`);
        if (!res.ok) throw new Error("Status check failed");
        const data = await res.json();
        
        if (active) {
          const newStatus = data.status as "OFFLINE" | "LIVE" | "ENDED";
          
          setStatus(newStatus);
          
          if (newStatus === "LIVE") {
            // Keep status live, but let the IVS player update the detailed health.
            // If health isn't already set by player playback events, default to CONNECTING
            setHealth((prev) => (prev === "OFFLINE" ? "CONNECTING" : prev));
          } else {
            setHealth("OFFLINE");
          }

          // Plan the next poll depending on the status
          scheduleNextPoll(newStatus);
        }
      } catch (err) {
        console.error("[StreamPlayerWrapper] Status poll failed:", err);
        if (active) {
          scheduleNextPoll(status === "LOADING" ? "OFFLINE" : status as any);
        }
      }
    }

    function scheduleNextPoll(currentStatus: "OFFLINE" | "LIVE" | "ENDED") {
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
      }

      if (!active || currentStatus === "ENDED") {
        // Stop polling completely if stream has ended or component unmounted
        return;
      }

      // OFFLINE streams poll more frequently (4s) to detect going live.
      // LIVE streams poll less frequently (8s) to detect going offline.
      const interval = currentStatus === "LIVE" ? 8000 : 4000;
      pollingTimerRef.current = setTimeout(checkStatus, interval);
    }

    // Run initial fetch
    checkStatus();

    return () => {
      active = false;
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
      }
    };
  }, [streamId]);

  return (
    <div className="space-y-6">
      {/* Dynamic Status and Health Header */}
      <div className="border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 bg-[#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          {status === "LIVE" && (
            <span className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span className="font-bold text-rose-500 tracking-wider text-xs sm:text-sm">LIVE NOW</span>
            </span>
          )}
          {status === "OFFLINE" && (
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#5C5C5C]"></span>
              <span className="font-bold text-[#9E9E9E] tracking-wider text-xs sm:text-sm">OFFLINE</span>
            </span>
          )}
          {status === "ENDED" && (
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#6366F1]"></span>
              <span className="font-bold text-[#6366F1] tracking-wider text-xs sm:text-sm">ENDED</span>
            </span>
          )}
          {status === "LOADING" && (
            <span className="flex items-center gap-2">
              <span className="animate-pulse h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
              <span className="font-bold text-yellow-400 tracking-wider text-xs sm:text-sm animate-pulse">CHECKING STATUS</span>
            </span>
          )}
        </div>

        {status === "LIVE" && (
          <div className="text-xs sm:text-xs font-semibold px-3.5 py-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#111111] flex items-center gap-2 w-fit">
            <span className="text-[#9E9E9E]">Stream Health:</span>
            {health === "LIVE" && <span className="text-emerald-400 font-bold">EXCELLENT</span>}
            {health === "BUFFERING" && <span className="text-yellow-400 font-bold animate-pulse">BUFFERING</span>}
            {health === "CONNECTING" && <span className="text-[#6366F1] font-bold animate-pulse">CONNECTING...</span>}
            {health === "OFFLINE" && <span className="text-[#9E9E9E] font-bold">CONNECTING...</span>}
          </div>
        )}
      </div>

      {/* Video Display Box */}
      <div className="border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 bg-[#171717] overflow-hidden min-h-[420px] flex flex-col items-center justify-center relative shadow-sm">
        {status === "LIVE" && playbackUrl ? (
          <IVSPlayer playbackUrl={playbackUrl} onStateChange={setHealth} />
        ) : status === "OFFLINE" ? (
          <div className="text-center p-8 space-y-4 max-w-md">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-xs font-mono text-[#6366F1] font-semibold animate-pulse">
              INGEST
            </div>
            <h3 className="text-base font-semibold text-white">Stream is Offline</h3>
            <p className="text-xs text-[#9E9E9E] leading-relaxed">
              We are waiting for the creator to start broadcasting from their streaming software. Grab a snack and hang tight!
            </p>
            <div className="text-[10px] text-[#6366F1] font-semibold tracking-wider uppercase animate-pulse">
              Listening for ingest signal...
            </div>
          </div>
        ) : status === "ENDED" ? (
          <div className="text-center p-8 space-y-4 max-w-md">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-xs font-mono text-[#6366F1] font-semibold">
              DONE
            </div>
            <h3 className="text-base font-semibold text-white">Stream Has Ended</h3>
            <p className="text-xs text-[#9E9E9E] leading-relaxed">
              This broadcast is complete. Check out other active streams or communities in the side navigation!
            </p>
          </div>
        ) : (
          <div className="text-center p-8 space-y-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6366F1] mx-auto"></div>
            <p className="text-xs text-[#9E9E9E] font-medium">Connecting to stream ingest feed...</p>
          </div>
        )}
      </div>
    </div>
  );
}
