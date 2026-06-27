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
      <div className="border border-white/10 rounded-2xl p-5 bg-slate-900/40 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {status === "LIVE" && (
            <span className="flex items-center gap-2">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
              </span>
              <span className="font-bold text-rose-500 tracking-wider text-sm sm:text-base">LIVE NOW</span>
            </span>
          )}
          {status === "OFFLINE" && (
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-500"></span>
              <span className="font-bold text-slate-400 tracking-wider text-sm sm:text-base">OFFLINE</span>
            </span>
          )}
          {status === "ENDED" && (
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-indigo-500"></span>
              <span className="font-bold text-indigo-400 tracking-wider text-sm sm:text-base">ENDED</span>
            </span>
          )}
          {status === "LOADING" && (
            <span className="flex items-center gap-2">
              <span className="animate-pulse h-3 w-3 rounded-full bg-yellow-500"></span>
              <span className="font-bold text-yellow-400 tracking-wider text-sm sm:text-base animate-pulse">CHECKING STATUS</span>
            </span>
          )}
        </div>

        {status === "LIVE" && (
          <div className="text-xs sm:text-sm font-semibold px-3.5 py-1 rounded-full border border-white/5 bg-black/30 flex items-center gap-2 w-fit">
            <span className="text-slate-400">Stream Health:</span>
            {health === "LIVE" && <span className="text-emerald-400 font-bold">🟢 EXCELLENT</span>}
            {health === "BUFFERING" && <span className="text-yellow-400 font-bold animate-pulse">🟡 BUFFERING</span>}
            {health === "CONNECTING" && <span className="text-indigo-400 font-bold animate-pulse">🔵 CONNECTING...</span>}
            {health === "OFFLINE" && <span className="text-slate-400 font-bold">⚫ CONNECTING...</span>}
          </div>
        )}
      </div>

      {/* Video Display Box */}
      <div className="border border-white/10 rounded-2xl p-4 bg-slate-900/40 backdrop-blur-sm overflow-hidden min-h-[420px] flex flex-col items-center justify-center relative">
        {status === "LIVE" && playbackUrl ? (
          <IVSPlayer playbackUrl={playbackUrl} onStateChange={setHealth} />
        ) : status === "OFFLINE" ? (
          <div className="text-center p-8 space-y-4 max-w-md">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-800/80 border border-white/5 flex items-center justify-center text-3xl animate-pulse">
              📺
            </div>
            <h3 className="text-lg font-bold text-slate-200">Stream is Offline</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We are waiting for the creator to start broadcasting from their streaming software. Grab a snack and hang tight!
            </p>
            <div className="text-xs text-indigo-400 font-semibold tracking-wider uppercase animate-pulse">
              Listening for ingest signal...
            </div>
          </div>
        ) : status === "ENDED" ? (
          <div className="text-center p-8 space-y-4 max-w-md">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-950/80 border border-indigo-500/10 flex items-center justify-center text-3xl">
              🏁
            </div>
            <h3 className="text-lg font-bold text-slate-200">Stream Has Ended</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              This broadcast is complete. Check out other active streams or communities in the side navigation!
            </p>
          </div>
        ) : (
          <div className="text-center p-8 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="text-sm text-slate-400 font-medium">Connecting to stream ingest feed...</p>
          </div>
        )}
      </div>
    </div>
  );
}
