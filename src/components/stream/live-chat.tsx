"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  messageId: string;
  userId: string;
  username: string;
  avatar: string;
  streamId: string;
  message: string;
  createdAt: string;
}

type Props = {
  streamId: string;
  currentUser: {
    id: string;
    username: string;
    imageUrl: string;
    email: string;
  } | null;
};

const getUsernameColor = (name: string) => {
  const colors = [
    "text-pink-400",
    "text-purple-400",
    "text-indigo-400",
    "text-cyan-400",
    "text-teal-400",
    "text-emerald-400",
    "text-amber-400",
    "text-orange-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default function LiveChat({ streamId, currentUser }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch message history on mount or streamId change
  useEffect(() => {
    setIsHistoryLoaded(false);
    setMessages([]);

    async function loadHistory() {
      try {
        const response = await fetch(`/api/messages?streamId=${streamId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setMessages(result.data);
          }
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setIsHistoryLoaded(true);
      }
    }

    loadHistory();
  }, [streamId]);

  // Initialize socket connection only after history is fully loaded
  useEffect(() => {
    if (!isHistoryLoaded) return;

    let socketUrl = "http://localhost:3001";
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      // Dynamically use the browser's current host to avoid localhost issues if accessed over network
      socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || `http://${hostname}:3001`;
    }
    console.log(`Connecting to WebSocket server at: ${socketUrl}`);
    
    const socket: Socket = io(socketUrl, {
      transports: ["polling", "websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("connected");
      console.log("Connected to WebSocket server");
      // Join stream room using streamId
      socket.emit("join-room", streamId);
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
      console.log("Disconnected from WebSocket server");
    });

    socket.on("connect_error", (error) => {
      setStatus("disconnected");
      console.error("WebSocket connection error details:", error);
    });

    // Receive message
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [streamId, isHistoryLoaded]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socketRef.current || status !== "connected" || !currentUser) return;

    socketRef.current.emit("send-message", {
      streamId,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.imageUrl,
      message: inputValue.trim(),
    });

    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#111111] overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)] bg-[#171717]">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === "connected" ? "bg-emerald-400" : status === "connecting" ? "bg-amber-400" : "bg-rose-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status === "connected" ? "bg-emerald-500" : status === "connecting" ? "bg-amber-500" : "bg-rose-500"}`}></span>
          </span>
          <h3 className="font-semibold text-white tracking-wide text-sm">Live Stream Chat</h3>
        </div>

        {/* Connection Status Badge */}
        <span className={`text-[9px] px-2.5 py-0.5 rounded font-mono font-semibold tracking-wider uppercase border ${
          status === "connected" 
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
            : status === "connecting"
            ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
        }`}>
          {status}
        </span>
      </div>

      {/* User Information Section */}
      <div className="px-6 py-2.5 border-b border-[rgba(255,255,255,0.08)] bg-[#171717]/40 flex items-center justify-between text-xs text-[#9E9E9E]">
        {currentUser ? (
          <div className="flex items-center gap-2">
            <img 
              src={currentUser.imageUrl} 
              alt={currentUser.username} 
              className="w-5 h-5 rounded-full object-cover border border-[rgba(255,255,255,0.08)]"
            />
            <span className="text-[#9E9E9E]">Chatting as:</span>
            <span className={`font-semibold ${getUsernameColor(currentUser.username)}`}>{currentUser.username}</span>
          </div>
        ) : (
          <span className="text-rose-400 font-medium">Please sign in to send messages</span>
        )}
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {!isHistoryLoaded ? (
          <div className="h-full flex flex-col items-center justify-center text-[#5C5C5C] text-xs gap-2 py-10">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#6366F1]" />
            <p>Loading chat history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#5C5C5C] text-xs gap-2 py-10">
            <svg className="w-8 h-8 opacity-40 animate-pulse text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>Welcome to the stream! Say hello in chat.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const timeStr = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div 
                key={msg.messageId} 
                className="group flex gap-3 hover:bg-white/5 -mx-4 px-4 py-2 rounded-lg transition duration-150"
              >
                <img 
                  src={msg.avatar} 
                  alt={msg.username} 
                  className="w-8 h-8 rounded-full object-cover border border-[rgba(255,255,255,0.08)] mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xs font-semibold ${getUsernameColor(msg.username)}`}>
                      {msg.username}
                    </span>
                    <span className="text-[9px] text-[#5C5C5C] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {timeStr}
                    </span>
                  </div>
                  <p className="text-sm text-[#9E9E9E] break-words leading-relaxed font-normal mt-0.5">
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-[#171717]/40">
        <div className="flex items-center gap-2 bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-xl p-1.5 focus-within:border-[#6366F1]/50 transition duration-200">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={status !== "connected" || !currentUser || !isHistoryLoaded}
            placeholder={
              !currentUser 
                ? "Sign in to participate..." 
                : !isHistoryLoaded
                ? "Loading history..."
                : status === "connected" 
                ? "Send a live message..." 
                : "Connecting to chat server..."
            }
            className="flex-1 bg-transparent px-3 py-1.5 text-sm text-white focus:outline-none disabled:text-[#5C5C5C] placeholder-[#5C5C5C]"
            maxLength={150}
          />
          <button
            type="submit"
            disabled={status !== "connected" || !inputValue.trim() || !currentUser || !isHistoryLoaded}
            className="bg-[#6366F1] hover:bg-[#5053E4] disabled:bg-[#6366F1]/30 disabled:text-[#5C5C5C] text-white font-medium text-xs px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
