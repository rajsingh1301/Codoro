"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ViewerCountProps {
  streamId?: string;
  initialCount: number;
}

export function formatViewerCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k";
  }
  return count.toString();
}

export function ViewerCount({ streamId, initialCount }: ViewerCountProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (!streamId) return;

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
      socket.emit("join-stream", { streamId, userId: "guest-card" });
    });

    socket.on("viewer-count", (data: { streamId: string; viewerCount: number }) => {
      if (data.streamId === streamId) {
        setCount(data.viewerCount);
      }
    });

    return () => {
      socket.emit("leave-stream", { streamId });
      socket.disconnect();
    };
  }, [streamId]);

  return (
    <div className="flex items-center gap-1.5 text-[#9E9E9E] font-mono text-[11px] font-medium">
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
