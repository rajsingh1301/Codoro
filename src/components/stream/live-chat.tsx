"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: string;
}

type Props = {
  streamId: string;
};

const ADJECTIVES = ["Speedy", "Clever", "Bit", "Byte", "Pixel", "Mega", "Giga", "Cyber", "Logic", "Async"];
const NOUNS = ["Coder", "Dev", "Hacker", "Ninja", "Wizard", "Geek", "Stack", "Bug", "Script", "Buffer"];

const generateRandomUsername = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${adj}${noun}${num}`;
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

export default function LiveChat({ streamId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize username
  useEffect(() => {
    const saved = localStorage.getItem("chat-username");
    if (saved) {
      setUsername(saved);
      setTempUsername(saved);
    } else {
      const generated = generateRandomUsername();
      setUsername(generated);
      setTempUsername(generated);
      localStorage.setItem("chat-username", generated);
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
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
      // Join stream room
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
  }, [streamId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socketRef.current || status !== "connected") return;

    socketRef.current.emit("send-message", {
      roomId: streamId,
      username,
      message: inputValue.trim(),
    });

    setInputValue("");
  };

  const handleSaveUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUsername.trim()) return;
    setUsername(tempUsername.trim());
    localStorage.setItem("chat-username", tempUsername.trim());
    setIsEditingUsername(false);
  };

  return (
    <div className="flex flex-col h-[550px] rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === "connected" ? "bg-emerald-400" : status === "connecting" ? "bg-amber-400" : "bg-rose-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${status === "connected" ? "bg-emerald-500" : status === "connecting" ? "bg-amber-500" : "bg-rose-500"}`}></span>
          </span>
          <h3 className="font-semibold text-white tracking-wide text-sm md:text-base">Live Stream Chat</h3>
        </div>

        {/* Connection Status Badge */}
        <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium tracking-wider uppercase border ${
          status === "connected" 
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
            : status === "connecting"
            ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
        }`}>
          {status}
        </span>
      </div>

      {/* Username Configuration Section */}
      <div className="px-6 py-3 border-b border-white/5 bg-slate-950/20 flex items-center justify-between text-xs text-slate-400">
        {isEditingUsername ? (
          <form onSubmit={handleSaveUsername} className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-indigo-500/50 flex-1 text-xs"
              placeholder="Enter new username..."
              maxLength={20}
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1 rounded transition duration-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setTempUsername(username);
                setIsEditingUsername(false);
              }}
              className="text-slate-400 hover:text-white px-2 py-1"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span>Chatting as:</span>
              <span className={`font-semibold ${getUsernameColor(username)}`}>{username}</span>
            </div>
            <button
              onClick={() => setIsEditingUsername(true)}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition duration-200"
            >
              Change Username
            </button>
          </>
        )}
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2 py-10">
            <svg className="w-8 h-8 opacity-40 animate-pulse text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>Welcome to the stream! Say hello in chat.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div 
                key={msg.id} 
                className="group flex flex-col space-y-0.5 hover:bg-white/5 -mx-4 px-4 py-1.5 rounded-lg transition duration-150"
              >
                <div className="flex items-baseline gap-2">
                  <span className={`text-xs font-semibold ${getUsernameColor(msg.username)}`}>
                    {msg.username}
                  </span>
                  <span className="text-[9px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {timeStr}
                  </span>
                </div>
                <p className="text-sm text-slate-200 break-words leading-relaxed font-normal">
                  {msg.message}
                </p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-slate-900/40">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 focus-within:border-indigo-500/50 transition duration-200">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={status !== "connected"}
            placeholder={status === "connected" ? "Send a live message..." : "Connecting to chat server..."}
            className="flex-1 bg-transparent px-3 py-1.5 text-sm text-white focus:outline-none disabled:text-slate-500 placeholder-slate-500"
            maxLength={150}
          />
          <button
            type="submit"
            disabled={status !== "connected" || !inputValue.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/30 disabled:text-slate-400/50 text-white font-medium text-xs px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
