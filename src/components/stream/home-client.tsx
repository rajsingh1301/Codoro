"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Play, Send } from "lucide-react";
import StreamCard from "./stream-card";
import { LiveBadge } from "../ui/live-badge";

type Stream = {
  streamId: string;
  title: string;
  description?: string;
  creatorName: string;
  creatorImage?: string;
  status: string;
  viewCount?: number;
  createdAt: string;
  communityId?: string;
};

type Community = {
  communityId: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  ownerImage?: string;
  createdAt: string;
};

type Props = {
  initialStreams: Stream[];
  initialCommunities: Community[];
};

export default function HomeClient({ initialStreams, initialCommunities }: Props) {
  // Create lookup dictionary for community names
  const communityLookup = useMemo(() => {
    const lookup: Record<string, string> = {};
    initialCommunities.forEach((c) => {
      lookup[c.communityId] = c.name;
    });
    return lookup;
  }, [initialCommunities]);

  const liveStreams = useMemo(() => {
    // Map database streams and force status to "LIVE" for presentation
    const dbStreams = initialStreams.map((s) => ({
      ...s,
      status: "LIVE",
    }));

    if (dbStreams.length >= 3) {
      return dbStreams.slice(0, 3);
    }

    const mockStreams = [
      {
        streamId: "mock-1",
        title: "Building a Rust HTTP server from scratch",
        creatorName: "@theo",
        creatorImage: "",
        description: "",
        status: "LIVE",
        viewCount: 1245,
        createdAt: new Date().toISOString(),
        communityId: "",
      },
      {
        streamId: "mock-2",
        title: "Refactoring the entire auth flow in Next.js",
        creatorName: "@mpj",
        creatorImage: "",
        description: "",
        status: "LIVE",
        viewCount: 847,
        createdAt: new Date().toISOString(),
        communityId: "",
      },
      {
        streamId: "mock-3",
        title: "Deploying Kubernetes clusters with Terraform",
        creatorName: "@tsndr",
        creatorImage: "",
        description: "",
        status: "LIVE",
        viewCount: 412,
        createdAt: new Date().toISOString(),
        communityId: "",
      },
    ];

    return [...dbStreams, ...mockStreams].slice(0, 3);
  }, [initialStreams]);

  return (
    <div className="w-full space-y-12">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-[rgba(255,255,255,0.08)]">
        
        {/* Beta Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/5 text-[10px] font-mono font-bold text-violet-400 select-none uppercase tracking-wider mb-6">
          ⚡ Now in Beta — Free for developers
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-[56px] font-extrabold tracking-tight leading-tight text-white">
            Developer-first live coding.
          </h1>

          <p className="text-[#9E9E9E] text-sm md:text-base max-w-[480px] mx-auto leading-relaxed font-medium">
            Share your screen, run AI coding reviews, and build awesome developer communities in real-time.
          </p>

          <div className="flex flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/dashboard"
              className="px-5 h-10 flex items-center justify-center rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              Start Streaming
            </Link>
            <Link
              href="/streams"
              className="px-5 h-10 flex items-center justify-center rounded-lg bg-transparent border border-[#2D2D5E] text-[#A09DC0] hover:border-[#7C3AED] hover:text-[#C4B5FD] font-semibold text-xs transition-all cursor-pointer"
            >
              Browse streams
            </Link>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-16 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 bg-[#0F0F1A] border border-[#1E1E3A] py-2 px-4 rounded-full text-xs font-semibold text-[#9E9E9E]">
            <span className="text-[#6366F1]">🤖</span> AI Coding Assistant
          </div>
          <div className="flex items-center gap-2 bg-[#0F0F1A] border border-[#1E1E3A] py-2 px-4 rounded-full text-xs font-semibold text-[#9E9E9E]">
            <span className="text-[#6366F1]">⚡</span> Low-latency via Amazon IVS
          </div>
          <div className="flex items-center gap-2 bg-[#0F0F1A] border border-[#1E1E3A] py-2 px-4 rounded-full text-xs font-semibold text-[#9E9E9E]">
            <span className="text-[#6366F1]">👥</span> Developer Communities
          </div>
        </div>

        {/* Product Preview Mockup */}
        <div 
          className="w-full max-w-[900px] mx-auto mt-12 border border-[#1E1E3A] rounded-xl bg-transparent p-0 overflow-hidden shadow-2xl relative"
          style={{ boxShadow: "0 -20px 60px rgba(124, 58, 237, 0.08)" }}
        >
          <div className="flex flex-col md:flex-row w-full">
            {/* Left Side: Mock VS Code Editor (Aspect 16/9) */}
            <div className="flex-grow bg-[#0f0f18] aspect-video relative flex flex-col font-mono text-[13px] leading-relaxed select-none text-left overflow-hidden">
              {/* Window Header / Titlebar */}
              <div className="h-8 border-b border-[rgba(255,255,255,0.04)] bg-[#0c0c14] flex items-center px-4 relative shrink-0">
                {/* 3 colored window control dots */}
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                
                {/* Filename tab centered */}
                <div className="absolute inset-x-0 mx-auto w-fit h-full flex items-center justify-center">
                  <div className="bg-[#0f0f18] px-4 h-full flex items-center border-l border-r border-[rgba(255,255,255,0.04)] text-[10px] font-bold text-[#A09DC0] gap-1.5 uppercase tracking-wide">
                    <span className="text-[#60A5FA] font-bold lowercase">ts</span> index.ts
                  </div>
                </div>

                {/* LIVE Badge overlay */}
                <div className="ml-auto z-10">
                  <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 text-[9px] font-bold text-rose-500 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    LIVE
                  </div>
                </div>
              </div>

              {/* Editor Workspace */}
              <div className="flex flex-1 overflow-hidden p-4 bg-[#0f0f18]">
                {/* Line Numbers Column */}
                <div className="w-8 select-none text-right pr-3 border-r border-[rgba(255,255,255,0.04)] text-[#4a4870] font-semibold space-y-0.5">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i + 1}>{i + 1}</div>
                  ))}
                </div>

                {/* Code highlight display area */}
                <div className="flex-1 pl-4 overflow-y-auto space-y-0.5 text-white font-mono text-[13px]">
                  <div><span className="text-[#C792EA]">import</span> {"{"} <span className="text-[#F07178]">IVSClient</span> {"}"} <span className="text-[#C792EA]">from</span> <span className="text-[#C3E88D]">'@aws-sdk/client-ivs'</span> <span className="text-[#4A4870]">// AWS Client</span></div>
                  <div><span className="text-[#C792EA]">import</span> {"{"} <span className="text-[#F07178]">BedrockClient</span> {"}"} <span className="text-[#C792EA]">from</span> <span className="text-[#C3E88D]">'@aws-sdk/bedrock'</span></div>
                  <div></div>
                  <div><span className="text-[#C792EA]">const</span> <span className="text-[#82AAFF]">streamConfig</span> = {"{"}</div>
                  <div>  <span className="text-[#F07178]">channelArn</span>: <span className="text-[#9E9E9E]">process</span>.<span className="text-[#9E9E9E]">env</span>.<span className="text-[#9E9E9E]">IVS_CHANNEL_ARN</span>,</div>
                  <div>  <span className="text-[#F07178]">latencyMode</span>: <span className="text-[#C3E88D]">'LOW'</span>,</div>
                  <div>  <span className="text-[#F07178]">type</span>: <span className="text-[#C3E88D]">'STANDARD'</span></div>
                  <div>{"}"}</div>
                  <div></div>
                  <div><span className="text-[#C792EA]">async function</span> <span className="text-[#82AAFF]">startStream</span>() {"{"}</div>
                  <div>  <span className="text-[#C792EA]">const</span> <span className="text-[#9E9E9E]">client</span> = <span className="text-[#C792EA]">new</span> <span className="text-[#82AAFF]">IVSClient</span>({"{"}</div>
                  <div>    <span className="text-[#F07178]">region</span>: <span className="text-[#C3E88D]">'us-east-1'</span></div>
                  <div>  {"}"})</div>
                  <div></div>
                  <div>  <span className="text-[#C792EA]">const</span> <span className="text-[#9E9E9E]">response</span> = <span className="text-[#C792EA]">await</span> <span className="text-[#9E9E9E]">client</span></div>
                  <div>    .<span className="text-[#82AAFF]">startStream</span>(<span className="text-[#9E9E9E]">streamConfig</span>)</div>
                  <div></div>
                  <div>  <span className="text-[#C792EA]">return</span> <span className="text-[#9E9E9E]">response</span>.<span className="text-[#F07178]">streamKey</span></div>
                  <div>{"}"}</div>
                  <div></div>
                </div>
              </div>
            </div>

            {/* Right Side: Chat Panel */}
            <div className="w-full md:w-[280px] bg-[#0F0F1A] border-t md:border-t-0 md:border-l border-[#1E1E3A] flex flex-col shrink-0 p-4 justify-between min-h-[240px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E1E3A] pb-2">
                  <span className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-wider font-mono">Live Chat Room</span>
                </div>
                
                {/* Fake chat messages in monospace font */}
                <div className="space-y-3 font-mono text-[11px] leading-relaxed text-[#9E9E9E]/85 text-left">
                  <div>
                    <span className="text-violet-400 font-bold">theo:</span> setting up AWS route table...
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold">mpj:</span> hooks are working now!
                  </div>
                  <div>
                    <span className="text-orange-400 font-bold">tsndr:</span> wait, check port 3000
                  </div>
                  <div>
                    <span className="text-purple-400 font-bold">raj:</span> looking very clean!
                  </div>
                  <div className="text-[#5C5C5C]">
                    *** raj has joined.
                  </div>
                </div>
              </div>

              {/* Message mock input */}
              <div className="bg-[#08080F] border border-[#1E1E3A] rounded-lg px-3 py-2 text-[10px] text-[#5C5C5C] flex items-center justify-between font-mono">
                <span>Type a message...</span>
                <Send size={10} className="text-[#5C5C5C]" />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* LIVE NOW (3 CARDS) SECTION */}
      {liveStreams.length > 0 && (
        <section className="py-12 max-w-[1280px] mx-auto px-6 lg:px-8 space-y-8 relative z-10">
          <div className="flex items-center gap-3">
            <LiveBadge />
            <h3 className="text-xl font-bold text-white">Live Now</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveStreams.map((stream) => (
              <StreamCard
                key={stream.streamId}
                stream={stream}
                communityName={stream.communityId ? communityLookup[stream.communityId] : undefined}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
