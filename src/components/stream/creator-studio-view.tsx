"use client";

import React from "react";
import Link from "next/link";
import StreamPlayerWrapper from "./stream-player-wrapper";
import CreatorDashboard from "./creator-dashboard";
import LiveChat from "./live-chat";
import AIAssistant from "../ai/ai-assistant";
import StreamSummaryDrawer from "../ai/stream-summary-drawer";
import { LiveBadge } from "../ui/live-badge";

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
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-8 text-primary">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-xs text-[#6366F1] hover:text-indigo-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              ← Dashboard
            </Link>
            <span className="text-[#5C5C5C] text-xs">•</span>
            <span className="text-xs text-[#9E9E9E] font-bold uppercase tracking-wider">Creator Studio</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white leading-none">{stream.title}</h1>
          <div className="flex items-center gap-3">
            {communityName && (
              <span className="inline-block text-[10px] font-mono font-semibold text-[#6366F1] border border-[rgba(255,255,255,0.08)] bg-[#111111] px-2.5 py-0.5 rounded-md">
                {communityName}
              </span>
            )}
            <span className="text-[10px] text-[#5C5C5C] font-mono font-semibold uppercase">
              Created: {new Date(stream.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pb-1 self-start md:self-center shrink-0">
          <StreamSummaryDrawer
            streamTitle={stream.title}
            streamDescription={stream.description || ""}
          />
          {isLive ? (
            <LiveBadge />
          ) : (
            <span className="h-7 px-3 flex items-center justify-center bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-[#5C5C5C]">
              OFFLINE
            </span>
          )}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Player Preview & Controls */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Live Preview Monitor */}
          <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden shadow-sm">
            <div className="border-b border-[rgba(255,255,255,0.08)] px-5 py-4 flex items-center justify-between bg-[#171717]">
              <span className="text-xs font-semibold uppercase text-[#9E9E9E] tracking-wider">Live Preview Monitor</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#5C5C5C] font-semibold">
                  {stream.viewCount || 0} Viewers
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
          <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="text-xs font-semibold uppercase text-[#9E9E9E] tracking-wider">Streaming Encoder Dashboard</h3>
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
            <h3 className="text-xs font-semibold uppercase text-[#9E9E9E] tracking-wider">Recent Stream Sessions</h3>
            
            {creatorStreams.length > 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {creatorStreams.filter(s => s.streamId !== stream.streamId).slice(0, 2).map((s) => (
                  <div
                    key={s.streamId}
                    className="group flex flex-col bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                  >
                    <div className="relative aspect-video w-full bg-[#070707] overflow-hidden border-b border-[rgba(255,255,255,0.08)]">
                      <div className="absolute inset-0 bg-[#070707] flex flex-col items-center justify-center">
                        <span className="font-mono text-[#5C5C5C] text-xs font-semibold tracking-widest opacity-30">
                          {s.streamId.substring(0, 8).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-[#6366F1] transition-colors">{s.title}</h4>
                        <p className="text-xs text-[#9E9E9E] line-clamp-2 leading-relaxed">
                          {s.description || "No description provided."}
                        </p>
                      </div>
                      <Link
                        href={`/streams/${s.streamId}`}
                        className="h-9 w-full flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] text-[#9E9E9E] hover:text-white hover:border-[rgba(255,255,255,0.16)] text-xs font-semibold bg-[#171717] transition-all cursor-pointer hover:-translate-y-0.5"
                      >
                        Configure Broadcast
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-[rgba(255,255,255,0.08)] rounded-2xl bg-[#111111] p-8 text-center text-xs text-[#5C5C5C] font-semibold shadow-sm">
                No previous broadcast sessions recorded.
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Live Chat & Stats panel */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8 h-fit">
          
          {/* Live Chat Client */}
          <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden h-[420px] flex flex-col shadow-sm">
            <div className="border-b border-[rgba(255,255,255,0.08)] px-5 py-4 bg-[#171717]">
              <span className="text-xs font-semibold uppercase text-[#9E9E9E] tracking-wider">Live Chat Room</span>
            </div>
            <div className="flex-grow overflow-hidden flex flex-col">
              <LiveChat streamId={stream.streamId} currentUser={user} />
            </div>
          </div>

          {/* Live Statistics */}
          <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase text-[#9E9E9E] tracking-wider">Session Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] p-4 rounded-xl flex flex-col gap-1 transition-all hover:border-[rgba(255,255,255,0.16)]">
                <span className="text-[10px] text-[#5C5C5C] font-semibold uppercase tracking-wider">Viewer Count</span>
                <span className="block text-2xl font-bold font-mono text-white">{stream.viewCount || 0}</span>
              </div>
              <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] p-4 rounded-xl flex flex-col gap-1 transition-all hover:border-[rgba(255,255,255,0.16)]">
                <span className="text-[10px] text-[#5C5C5C] font-semibold uppercase tracking-wider">Stream Status</span>
                <span className={`block text-xs font-mono font-bold uppercase mt-2.5 ${isLive ? "text-red-500" : "text-[#5C5C5C]"}`}>
                  {isLive ? "LIVE" : "OFFLINE"}
                </span>
              </div>
              <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] p-4 rounded-xl flex flex-col gap-1 transition-all hover:border-[rgba(255,255,255,0.16)]">
                <span className="text-[10px] text-[#5C5C5C] font-semibold uppercase tracking-wider">Total Streams</span>
                <span className="block text-2xl font-bold font-mono text-white">{totalStreamsCount}</span>
              </div>
              <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] p-4 rounded-xl flex flex-col gap-1 transition-all hover:border-[rgba(255,255,255,0.16)]">
                <span className="text-[10px] text-[#5C5C5C] font-semibold uppercase tracking-wider">Communities</span>
                <span className="block text-2xl font-bold font-mono text-white">{communitiesCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase text-[#9E9E9E] tracking-wider">Creator Shortcuts</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/communities"
                className="flex flex-col items-center justify-center p-4 bg-[#171717] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-xl text-center group cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <span className="text-[10px] font-semibold text-[#9E9E9E] group-hover:text-white">New Stream</span>
              </Link>
              <Link
                href="/communities"
                className="flex flex-col items-center justify-center p-4 bg-[#171717] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-xl text-center group cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <span className="text-[10px] font-semibold text-[#9E9E9E] group-hover:text-white">Communities</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex flex-col items-center justify-center p-4 bg-[#171717] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-xl text-center group cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <span className="text-[10px] font-semibold text-[#9E9E9E] group-hover:text-white">Dashboard</span>
              </Link>
              <button
                onClick={() => alert("Configure Profile settings in the Dashboard Settings tab.")}
                className="flex flex-col items-center justify-center p-4 bg-[#171717] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-xl text-center group cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <span className="text-[10px] font-semibold text-[#9E9E9E] group-hover:text-white">Settings</span>
              </button>
            </div>
          </div>

          {/* AI Tools Cards */}
          <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase text-[#9E9E9E] tracking-wider">AI Streaming Tools</h3>
            <div className="space-y-4">
              <AIAssistant
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
