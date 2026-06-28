import React from "react";
import { getAllStreams } from "@/src/services/streams-services";
import { getCommunities } from "@/src/services/community-services";
import StreamCard from "@/src/components/stream/stream-card";
import Link from "next/link";

export const revalidate = 0;

export default async function StreamsPage() {
  const streamsData = await getAllStreams();
  const communitiesData = await getCommunities();

  const communityLookup: Record<string, string> = {};
  communitiesData.forEach((c: any) => {
    communityLookup[c.communityId] = c.name;
  });

  const streams = streamsData.map((s: any) => ({
    streamId: s.streamId,
    title: s.title,
    description: s.description || "",
    creatorName: s.creatorName,
    creatorImage: s.creatorImage || "",
    status: s.status || "OFFLINE",
    viewCount: s.viewCount || 0,
    createdAt: s.createdAt,
    communityId: s.communityId || "",
  }));

  return (
    <div className="min-h-screen w-full relative">
      {/* Dark Dot Matrix */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#0a0a0a',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
            radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
          imageRendering: 'pixelated',
        }}
      />
      {/* existing page content — relative z-10 lagao taaki content dot matrix ke upar rahe */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-8 text-primary">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-primary tracking-tight">Active Broadcasts</h1>
            <p className="text-sm text-[#9E9E9E]">Browse live and offline developer streams across all communities</p>
          </div>
        </div>

        {streams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {streams.map((stream) => (
              <StreamCard
                key={stream.streamId}
                stream={stream}
                communityName={stream.communityId ? communityLookup[stream.communityId] : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-lg bg-surface p-12 text-center max-w-xl mx-auto space-y-4">
            <span className="text-4xl block opacity-50">📡</span>
            <h4 className="text-primary font-bold text-lg">No streams found</h4>
            <p className="text-[#9E9E9E] text-sm">
              Start a live stream inside a developer community to build in public.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex h-9 px-4 items-center justify-center rounded-md bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-sm transition-colors mt-2"
            >
              Create Your First Stream
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
