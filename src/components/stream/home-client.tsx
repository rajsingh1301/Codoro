"use client";

import React, { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import StreamCard, { StreamCardSkeleton } from "./stream-card";

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

const CATEGORIES = [
  "All Categories",
  "Go",
  "React",
  "Next.js",
  "TypeScript",
  "AWS",
  "Docker",
  "Kubernetes",
  "Python",
  "AI",
  "Machine Learning",
  "DevOps",
  "Open Source",
];

export default function HomeClient({ initialStreams, initialCommunities }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeFilter, setActiveFilter] = useState<"all" | "live" | "offline" | "newest" | "viewed">("all");
  const [isPending, startTransition] = useTransition();

  // Create lookup dictionary for community names
  const communityLookup = useMemo(() => {
    const lookup: Record<string, string> = {};
    initialCommunities.forEach((c) => {
      lookup[c.communityId] = c.name;
    });
    return lookup;
  }, [initialCommunities]);

  // Compute stream counts for each community
  const communityStats = useMemo(() => {
    const stats: Record<string, { total: number; live: number }> = {};
    initialCommunities.forEach((c) => {
      stats[c.communityId] = { total: 0, live: 0 };
    });
    initialStreams.forEach((s) => {
      if (s.communityId && stats[s.communityId]) {
        stats[s.communityId].total += 1;
        if (s.status === "LIVE") {
          stats[s.communityId].live += 1;
        }
      }
    });
    return stats;
  }, [initialStreams, initialCommunities]);

  // Client side search, category selection, and filter/sorting logic
  const filteredStreams = useMemo(() => {
    let result = [...initialStreams];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((s) => {
        const titleMatch = s.title.toLowerCase().includes(query);
        const creatorMatch = s.creatorName.toLowerCase().includes(query);
        const communityName = s.communityId ? communityLookup[s.communityId] : "";
        const communityMatch = communityName ? communityName.toLowerCase().includes(query) : false;
        return titleMatch || creatorMatch || communityMatch;
      });
    }

    // 2. Category Filter
    if (selectedCategory !== "All Categories") {
      const cat = selectedCategory.toLowerCase();
      result = result.filter((s) => {
        const inTitle = s.title.toLowerCase().includes(cat);
        const inDesc = s.description ? s.description.toLowerCase().includes(cat) : false;
        return inTitle || inDesc;
      });
    }

    // 3. Status Filters & Ordering
    if (activeFilter === "live") {
      result = result.filter((s) => s.status === "LIVE");
    } else if (activeFilter === "offline") {
      result = result.filter((s) => s.status !== "LIVE");
    } else if (activeFilter === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeFilter === "viewed") {
      result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    }

    return result;
  }, [initialStreams, searchQuery, selectedCategory, activeFilter, communityLookup]);

  // Split streams for dedicated dashboard columns
  const liveStreams = useMemo(() => {
    return filteredStreams.filter((s) => s.status === "LIVE");
  }, [filteredStreams]);

  const recentStreams = useMemo(() => {
    return filteredStreams.filter((s) => s.status !== "LIVE");
  }, [filteredStreams]);

  // Smooth scroll to streams section
  const handleScrollToExplore = () => {
    const section = document.getElementById("explore-streams");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden rounded-[14px] border border-border-main bg-card-bg p-8 sm:p-12 md:p-16 text-center">
        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/20 bg-brand/10 text-brand text-xs font-semibold tracking-wide uppercase">
            🚀 CodeLive Beta Now Active
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-txt-primary">
            Learn. Build. Stream.
          </h1>

          <p className="text-txt-secondary text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            The developer-first live streaming hub. Share your screen, collaborate on projects, run AI coding reviews, and build awesome developer communities in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-sm tracking-wide transition duration-200 cursor-pointer"
            >
              Start Streaming
            </Link>
            <button
              onClick={handleScrollToExplore}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-card-bg border border-border-main hover:bg-hover-bg text-txt-secondary hover:text-txt-primary font-bold text-sm tracking-wide transition duration-200 cursor-pointer"
            >
              Explore Live Streams
            </button>
          </div>
        </div>
      </section>

      {/* SEARCH, CATEGORIES, AND FILTERING BAR */}
      <section id="explore-streams" className="scroll-mt-24 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col gap-1.5 w-full md:max-w-md">
            <h2 className="text-lg font-bold text-txt-primary">Explore Broadcasts</h2>
            <p className="text-xs text-txt-muted">Discover active communities and developer-led coding streams</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-sm">
            <span className="absolute inset-y-0 left-3 flex items-center text-txt-muted text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by title, creator, or community..."
              value={searchQuery}
              onChange={(e) => {
                startTransition(() => {
                  setSearchQuery(e.target.value);
                });
              }}
              className="w-full pl-9 pr-4 py-2.5 bg-card-bg border border-border-main focus:border-brand/45 rounded-xl text-txt-primary text-sm placeholder:text-txt-muted outline-none transition duration-200"
            />
          </div>
        </div>

        {/* Developer Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border-main scrollbar-track-transparent">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => {
                  startTransition(() => {
                    setSelectedCategory(category);
                  });
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-brand border-brand text-white"
                    : "bg-card-bg border-border-main text-txt-secondary hover:border-border-main hover:text-txt-primary"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Sorting and State Filters */}
        <div className="flex border-b border-border-main pb-1 gap-6 text-sm overflow-x-auto">
          {(["all", "live", "offline", "newest", "viewed"] as const).map((filter) => {
            const isActive = activeFilter === filter;
            const labels: Record<string, string> = {
              all: "All Streams",
              live: "Live Now",
              offline: "Offline",
              newest: "Newest",
              viewed: "Most Viewed",
            };
            return (
              <button
                key={filter}
                onClick={() => {
                  startTransition(() => {
                    setActiveFilter(filter);
                  });
                }}
                className={`pb-3 font-semibold transition border-b-2 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-brand text-txt-primary"
                    : "border-transparent text-txt-muted hover:text-txt-secondary"
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: LIVE NOW */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-xl font-bold text-txt-primary">Live Now</h3>
          </div>
          <span className="text-xs text-txt-muted font-semibold uppercase tracking-wider bg-card-bg border border-border-main px-2.5 py-1 rounded-xl">
            {liveStreams.length} active
          </span>
        </div>

        {isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <StreamCardSkeleton key={i} />
            ))}
          </div>
        ) : liveStreams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {liveStreams.map((stream) => (
              <StreamCard
                key={stream.streamId}
                stream={stream}
                communityName={stream.communityId ? communityLookup[stream.communityId] : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="border border-border-main rounded-[14px] bg-card-bg p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <span className="text-4xl block">📡</span>
            <h4 className="text-txt-primary font-bold text-lg">No one is streaming right now.</h4>
            <p className="text-txt-secondary text-xs leading-relaxed max-w-xs mx-auto">
              Be the first to share your screen or camera with CodeLive and start building in public.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs tracking-wider cursor-pointer transition duration-200"
            >
              Be the first to go live
            </Link>
          </div>
        )}
      </section>

      {/* SECTION 3: FEATURED COMMUNITIES */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-txt-primary">Featured Communities</h3>
        
        {initialCommunities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialCommunities.map((community) => {
              const stats = communityStats[community.communityId] || { total: 0, live: 0 };
              return (
                <Link
                  key={community.communityId}
                  href={`/communities/${community.communityId}`}
                  className="group block p-6 rounded-[14px] bg-card-bg hover:bg-card-elevated border border-border-main transition duration-200 shadow-sm cursor-pointer"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-txt-primary font-bold text-base transition group-hover:text-brand">
                        {community.name}
                      </h4>
                      {stats.live > 0 && (
                        <span className="text-[10px] font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/10 animate-pulse">
                          ● LIVE ({stats.live})
                        </span>
                      )}
                    </div>
                    <p className="text-txt-secondary text-xs leading-relaxed line-clamp-2">
                      {community.description}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-txt-muted font-semibold uppercase tracking-wider border-t border-border-main pt-4">
                      <span>🎬 {stats.total} Total Streams</span>
                      <span>•</span>
                      <span>📺 {stats.live} Active Stream{stats.live === 1 ? '' : 's'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="border border-border-main rounded-[14px] bg-card-bg p-12 text-center max-w-xl mx-auto space-y-3 shadow-sm">
            <span className="text-4xl block">👥</span>
            <h4 className="text-txt-primary font-bold text-base">No communities found.</h4>
            <p className="text-txt-secondary text-xs">
              Communities bring together creators studying the same programming stacks.
            </p>
            <Link
              href="/communities/create"
              className="inline-block px-5 py-2 rounded-xl border border-border-main hover:bg-hover-bg text-txt-secondary hover:text-txt-primary font-bold text-xs tracking-wider cursor-pointer transition duration-200"
            >
              Create Community
            </Link>
          </div>
        )}
      </section>

      {/* SECTION 4: RECENTLY CREATED STREAMS */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-txt-primary">Recently Created / Upcoming Streams</h3>

        {isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <StreamCardSkeleton key={i} />
            ))}
          </div>
        ) : recentStreams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentStreams.map((stream) => (
              <StreamCard
                key={stream.streamId}
                stream={stream}
                communityName={stream.communityId ? communityLookup[stream.communityId] : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-card-bg border border-dashed border-border-main rounded-[14px] max-w-md mx-auto shadow-sm">
            <p className="text-txt-muted text-xs">No recently created or offline streams match the selected criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}
