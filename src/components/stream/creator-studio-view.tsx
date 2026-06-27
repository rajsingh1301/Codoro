"use client";

import React from "react";
import Link from "next/link";
import StreamPlayerWrapper from "./stream-player-wrapper";
import CreatorDashboard from "./creator-dashboard";
import LiveChat from "./live-chat";
import AIAssistant from "../ai/ai-assistant";
import StreamSummary from "../ai/stream-summary";

type Stream = {
  streamId: string;
  title: string;
  description?: string;
  creatorId: string;
  creatorName: string;
  status: string;
  viewCount?: number;
  createdAt: string;
  communityId?: string;
  playbackUrl?: string;
  streamKey?: string;
  channelArn?: string;
};

type Props = {
  stream: Stream;
  user: any;
  ingestEndpoint: string;
  communityName: string;
  totalStreamsCount: number;
  communitiesCount: number;
  creatorStreams: Stream[];
};

function getGradientFromTitle(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradients = [
    "from-indigo-950 to-slate-900",
    "from-neutral-900 to-zinc-800",
    "from-slate-950 to-neutral-900",
  ];
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export default function CreatorStudioView({
  stream,
  user,
  ingestEndpoint,
  communityName,
  totalStreamsCount,
  communitiesCount,
  creatorStreams,
}: Props) {
  const isLive = stream.status === "LIVE";

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-8 text-txt-primary">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-main pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-xs text-brand hover:text-brand-hover font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Dashboard
            </Link>
            <span className="text-txt-muted text-xs">•</span>
            <span className="text-xs text-txt-muted font-bold uppercase tracking-wider">Creator Studio</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-txt-primary">{stream.title}</h1>
          <div className="flex items-center gap-3">
            {communityName && (
              <span className="inline-block text-[10px] font-bold text-brand uppercase bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-full">
                {communityName}
              </span>
            )}
            <span className="text-[10px] text-txt-muted font-bold uppercase">
              Created: {new Date(stream.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card-bg border border-border-main px-4 py-2 rounded-xl">
            <span className={`h-2.5 w-2.5 rounded-full ${isLive ? "bg-rose-500 animate-pulse" : "bg-txt-muted"}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-txt-primary">
              {isLive ? "LIVE" : "OFFLINE"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Player Preview & Controls */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Live Preview Monitor */}
          <div className="bg-card-bg border border-border-main rounded-[14px] overflow-hidden shadow-sm">
            <div className="border-b border-border-main px-5 py-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-txt-secondary tracking-wider">Live Preview Monitor</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-txt-muted font-semibold">
                  👤 {stream.viewCount || 0} Viewers
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <StreamPlayerWrapper
                streamId={stream.streamId}
                playbackUrl={stream.playbackUrl || ""}
                initialStatus={stream.status as any}
              />
            </div>
          </div>

          {/* Broadcaster & Ingestion Controls */}
          <div className="bg-card-bg border border-border-main rounded-[14px] p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase text-txt-secondary tracking-wider">Streaming Encoder Dashboard</h3>
            <CreatorDashboard
              streamId={stream.streamId}
              playbackUrl={stream.playbackUrl || ""}
              streamKey={stream.streamKey || ""}
              channelArn={stream.channelArn || ""}
              ingestEndpoint={ingestEndpoint}
            />
          </div>

          {/* Recent Streams */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase text-txt-secondary tracking-wider">Recent Stream Sessions</h3>
            
            {creatorStreams.length > 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {creatorStreams.filter(s => s.streamId !== stream.streamId).slice(0, 2).map((s) => {
                  const gradientClass = getGradientFromTitle(s.title);
                  return (
                    <div
                      key={s.streamId}
                      className="group flex flex-col bg-card-bg border border-border-main hover:border-brand/40 rounded-[14px] overflow-hidden transition"
                    >
                      <div className="relative aspect-video w-full bg-[#0a0a0a] overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex flex-col justify-between p-4`}>
                          <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider">
                            Previous Broadcast
                          </span>
                          <h5 className="text-white font-extrabold text-xs text-center drop-shadow px-2 line-clamp-2">
                            {s.title}
                          </h5>
                          <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider text-right">
                            {new Date(s.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs text-txt-primary line-clamp-1 group-hover:text-brand transition">{s.title}</h4>
                          <p className="text-[11px] text-txt-secondary line-clamp-2 leading-relaxed">
                            {s.description || "No description provided."}
                          </p>
                        </div>
                        <Link
                          href={`/streams/${s.streamId}`}
                          className="w-full text-center py-2.5 rounded-xl border border-border-main hover:border-brand/40 text-txt-secondary hover:text-txt-primary font-bold text-xs bg-surface transition cursor-pointer"
                        >
                          Configure Broadcast
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-border-main rounded-[14px] bg-card-bg p-8 text-center text-xs text-txt-muted font-medium">
                No previous broadcast sessions recorded.
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Live Chat & Stats panel */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8 h-fit">
          
          {/* Live Chat Client */}
          <div className="bg-card-bg border border-border-main rounded-[14px] overflow-hidden shadow-sm h-[420px] flex flex-col">
            <div className="border-b border-border-main px-5 py-4">
              <span className="text-xs font-bold uppercase text-txt-secondary tracking-wider">Live Chat Room</span>
            </div>
            <div className="flex-grow overflow-hidden flex flex-col">
              <LiveChat streamId={stream.streamId} currentUser={user} />
            </div>
          </div>

          {/* Live Statistics */}
          <div className="bg-card-bg border border-border-main rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase text-txt-secondary tracking-wider">Session Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface border border-border-main p-4 rounded-xl">
                <span className="text-[10px] text-txt-muted font-bold uppercase tracking-wider">Viewer Count</span>
                <span className="block text-lg font-black text-txt-primary mt-1">{stream.viewCount || 0}</span>
              </div>
              <div className="bg-surface border border-border-main p-4 rounded-xl">
                <span className="text-[10px] text-txt-muted font-bold uppercase tracking-wider">Stream Status</span>
                <span className={`block text-xs font-bold uppercase mt-2.5 ${isLive ? "text-rose-500" : "text-txt-muted"}`}>
                  {isLive ? "LIVE" : "OFFLINE"}
                </span>
              </div>
              <div className="bg-surface border border-border-main p-4 rounded-xl">
                <span className="text-[10px] text-txt-muted font-bold uppercase tracking-wider">Total Streams</span>
                <span className="block text-lg font-black text-txt-primary mt-1">{totalStreamsCount}</span>
              </div>
              <div className="bg-surface border border-border-main p-4 rounded-xl">
                <span className="text-[10px] text-txt-muted font-bold uppercase tracking-wider">Communities</span>
                <span className="block text-lg font-black text-txt-primary mt-1">{communitiesCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-card-bg border border-border-main rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase text-txt-secondary tracking-wider">Creator Shortcuts</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/communities"
                className="flex flex-col items-center justify-center p-4 bg-surface border border-border-main hover:border-brand/40 rounded-xl text-center group cursor-pointer transition"
              >
                <span className="text-lg text-brand">🎬</span>
                <span className="text-[10px] font-bold text-txt-secondary group-hover:text-brand mt-2">New Stream</span>
              </Link>
              <Link
                href="/communities"
                className="flex flex-col items-center justify-center p-4 bg-surface border border-border-main hover:border-brand/40 rounded-xl text-center group cursor-pointer transition"
              >
                <span className="text-lg text-brand">👥</span>
                <span className="text-[10px] font-bold text-txt-secondary group-hover:text-brand mt-2">Communities</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex flex-col items-center justify-center p-4 bg-surface border border-border-main hover:border-brand/40 rounded-xl text-center group cursor-pointer transition"
              >
                <span className="text-lg text-brand">📊</span>
                <span className="text-[10px] font-bold text-txt-secondary group-hover:text-brand mt-2">Dashboard</span>
              </Link>
              <button
                onClick={() => alert("Configure Profile settings in the Dashboard Settings tab.")}
                className="flex flex-col items-center justify-center p-4 bg-surface border border-border-main hover:border-brand/40 rounded-xl text-center group cursor-pointer transition"
              >
                <span className="text-lg text-brand">⚙️</span>
                <span className="text-[10px] font-bold text-txt-secondary group-hover:text-brand mt-2">Settings</span>
              </button>
            </div>
          </div>

          {/* AI Tools Cards */}
          <div className="bg-card-bg border border-border-main rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase text-txt-secondary tracking-wider">AI Streaming Tools</h3>
            <div className="space-y-4">
              <AIAssistant
                streamTitle={stream.title}
                streamDescription={stream.description || ""}
              />
              <StreamSummary
                streamTitle={stream.title}
                streamDescription={stream.description || ""}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
