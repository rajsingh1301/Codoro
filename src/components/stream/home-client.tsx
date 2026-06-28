"use client";

import React, { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import StreamCard, { StreamCardSkeleton } from "./stream-card";
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
    return initialStreams.filter((s) => s.status === "LIVE").slice(0, 3);
  }, [initialStreams]);

  return (
    <div className="w-full">
      {/* SECTION 1: HERO */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-border">


        <div className="max-w-3xl mx-auto space-y-6 z-10">
          <h1 className="text-5xl md:text-[56px] font-bold tracking-tight leading-tight text-primary">
            Developer-first live coding.
          </h1>

          <p className="text-secondary text-base max-w-lg mx-auto leading-relaxed font-medium">
            Share your screen, run AI coding reviews, and build awesome developer communities in real-time.
          </p>

          <div className="flex flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/dashboard"
              className="px-5 h-10 flex items-center justify-center rounded-md bg-accent hover:bg-violet-600 text-white font-medium text-sm transition-colors"
            >
              Start Streaming
            </Link>
            <Link
              href="/streams"
              className="px-5 h-10 flex items-center justify-center rounded-md bg-transparent border border-border text-secondary hover:border-border-bright hover:text-primary font-medium text-sm transition-colors"
            >
              Explore Streams
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: LIVE NOW (3 CARDS) */}
      <section className="py-24 max-w-[1280px] mx-auto px-6 lg:px-8 space-y-8">
        <div className="flex items-center gap-3">
          <LiveBadge />
          <h3 className="text-xl font-bold text-primary">Live Now</h3>
        </div>

        {liveStreams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveStreams.map((stream) => (
              <StreamCard
                key={stream.streamId}
                stream={stream}
                communityName={stream.communityId ? communityLookup[stream.communityId] : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mock live streams if none exist */}
            <StreamCard
              stream={{
                streamId: "mock-1",
                title: "Building a Rust HTTP server from scratch",
                creatorName: "@theo",
                status: "LIVE",
                viewCount: 1245,
                createdAt: new Date().toISOString(),
              }}
              communityName="Rust"
            />
            <StreamCard
              stream={{
                streamId: "mock-2",
                title: "Refactoring the entire auth flow in Next.js",
                creatorName: "@mpj",
                status: "LIVE",
                viewCount: 847,
                createdAt: new Date().toISOString(),
              }}
              communityName="React"
            />
            <StreamCard
              stream={{
                streamId: "mock-3",
                title: "Deploying Kubernetes clusters with Terraform",
                creatorName: "@tsndr",
                status: "LIVE",
                viewCount: 412,
                createdAt: new Date().toISOString(),
              }}
              communityName="DevOps"
            />
          </div>
        )}
      </section>
    </div>
  );
}
