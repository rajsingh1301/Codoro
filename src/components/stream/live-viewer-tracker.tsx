"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Props = {
  streamId: string;
  totalViews: number;
  userId: string;
};

export default function LiveViewerTracker({ streamId, totalViews, userId }: Props) {
  const [watchingNow, setWatchingNow] = useState(0);

  useEffect(() => {
    let socketUrl = "http://localhost:3001";
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || `http://${hostname}:3001`;
    }

    const socket: Socket = io(socketUrl, {
      transports: ["polling", "websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("[LiveViewerTracker] Connected to Socket.io. Joining stream presence room...");
      socket.emit("join-stream", { streamId, userId });
    });

    socket.on("viewer-count", (data: { streamId: string; viewerCount: number }) => {
      if (data.streamId === streamId) {
        setWatchingNow(data.viewerCount);
      }
    });

    return () => {
      console.log("[LiveViewerTracker] Unmounting, leaving presence room and disconnecting...");
      socket.emit("leave-stream", { streamId });
      socket.disconnect();
    };
  }, [streamId, userId]);

  return (
    <div className="mt-2 space-y-2">
      {/* Real-time Presence UI */}
      <div className="flex items-center gap-2 text-xs md:text-sm text-rose-500 font-bold uppercase tracking-wider">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        🔴 LIVE NOW
      </div>

      <div className="flex items-center gap-3 text-xs md:text-sm font-medium mt-1.5 flex-wrap">
        <span className="flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full">
          👁 Watching Now: <strong className="font-bold text-rose-200">{watchingNow}</strong>
        </span>
        <span className="flex items-center gap-1.5 bg-slate-800/40 text-slate-400 border border-white/5 px-3 py-1 rounded-full backdrop-blur-sm">
          📈 Total Views: <strong className="font-bold text-slate-200">{totalViews}</strong>
        </span>
      </div>
    </div>
  );
}
