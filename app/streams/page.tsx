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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-8 text-txt-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-txt-primary tracking-tight">Active Broadcasts</h1>
          <p className="text-sm text-txt-secondary">Browse live and offline developer streams across all communities</p>
        </div>
      </div>

      {streams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {streams.map((stream) => (
            <StreamCard
              key={stream.streamId}
              stream={stream}
              communityName={stream.communityId ? communityLookup[stream.communityId] : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="border border-border-main rounded-[14px] bg-card-bg p-16 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <span className="text-4xl block">📡</span>
          <h4 className="text-txt-primary font-bold text-lg">No streams found.</h4>
          <p className="text-txt-secondary text-xs">
            Start a live stream inside a developer community to build in public.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs tracking-wider cursor-pointer transition duration-200"
          >
            Create Your First Stream
          </Link>
        </div>
      )}
    </div>
  );
}
