"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Users, Radio, MessageSquare } from "lucide-react";

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
  dbCommunities: Community[];
};

function getTechCategory(name: string): "React" | "Go" | "Java" | "Web3" {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("react") || lowerName.includes("next")) return "React";
  if (lowerName.includes("go") || lowerName.includes("golang")) return "Go";
  if (lowerName.includes("java") || lowerName.includes("spring") || lowerName.includes("boot")) return "Java";
  if (lowerName.includes("web3") || lowerName.includes("block") || lowerName.includes("crypto") || lowerName.includes("solidity")) return "Web3";
  return "React"; // Fallback default
}

function getRichDescription(name: string, currentDesc: string): string {
  const cleanDesc = currentDesc ? currentDesc.trim() : "";
  const lowerDesc = cleanDesc.toLowerCase();
  
  // Replace simple placeholder descriptions
  if (
    !cleanDesc || 
    lowerDesc.length < 20 || 
    lowerDesc.includes("everything react") || 
    lowerDesc.includes("devops") || 
    lowerDesc.includes("member groups")
  ) {
    const tech = getTechCategory(name);
    if (tech === "React") return "Collaborate on interactive frontend UI designs, explore React 19 features, and share code logic using modern Next.js templates.";
    if (tech === "Go") return "Deep dive into Golang backend architectures, explore gRPC APIs, concurrent channels, and build high-throughput systems.";
    if (tech === "Java") return "Master enterprise development with Spring Boot framework architectures, MVC bindings, and high-performance server structures.";
    if (tech === "Web3") return "Build decentralized applications, write smart contracts in Solidity, and explore Web3 frontend integration frameworks.";
  }
  return currentDesc;
}

function getMockStats(name: string): { memberCount: string; liveCount: string } {
  const tech = getTechCategory(name);
  if (tech === "React") return { memberCount: "892 Members", liveCount: "3 Live Streams" };
  if (tech === "Go") return { memberCount: "412 Members", liveCount: "1 Live Stream" };
  if (tech === "Java") return { memberCount: "678 Members", liveCount: "0 Active" };
  if (tech === "Web3") return { memberCount: "318 Members", liveCount: "2 Live Streams" };
  return { memberCount: "124 Members", liveCount: "0 Active" };
}

export default function CommunitiesClient({ dbCommunities }: Props) {
  const [filter, setFilter] = useState<"All" | "React" | "Go" | "Java" | "Web3">("All");

  const enrichedCommunities = useMemo(() => {
    return dbCommunities.map((c) => {
      const tech = getTechCategory(c.name);
      const desc = getRichDescription(c.name, c.description);
      const stats = getMockStats(c.name);
      return {
        ...c,
        tech,
        description: desc,
        ...stats,
      };
    });
  }, [dbCommunities]);

  const filteredCommunities = useMemo(() => {
    if (filter === "All") return enrichedCommunities;
    return enrichedCommunities.filter((c) => c.tech === filter);
  }, [enrichedCommunities, filter]);

  const categories: ("All" | "React" | "Go" | "Java" | "Web3")[] = [
    "All",
    "React",
    "Go",
    "Java",
    "Web3",
  ];

  return (
    <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-10 flex-grow">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-[rgba(255,255,255,0.08)] pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Communities</h1>
          <p className="text-sm text-[#9E9E9E]">
            Discover and join stream circles of shared developer technologies.
          </p>
        </div>
        
        <Link
          href="/communities/create"
          className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-sm transition-all shadow-sm cursor-pointer hover:-translate-y-0.5 shrink-0"
        >
          <Plus size={16} className="mr-2" /> Create Community
        </Link>
      </div>

      {/* FILTER ROW */}
      <div className="flex flex-wrap items-center gap-3">
        {categories.map((cat) => {
          const isActive = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? "bg-[#6366F1] text-white border-[#6366F1] shadow-sm"
                  : "bg-[#171717] text-[#9E9E9E] border-[rgba(255,255,255,0.08)] hover:text-white hover:border-[rgba(255,255,255,0.16)]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* GRID DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => {
          // Color-coded tech badge style mapping
          const badgeStyles = {
            React: "bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1]",
            Go: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
            Java: "bg-orange-500/10 border border-orange-500/20 text-orange-400",
            Web3: "bg-purple-500/10 border border-purple-500/20 text-purple-400",
          };

          return (
            <Link
              key={community.communityId}
              href={`/communities/${community.communityId}`}
              className="block cursor-pointer h-full"
            >
              <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-2xl p-6 flex flex-col justify-between h-full group transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-sm font-bold text-white group-hover:text-[#6366F1] transition duration-200 line-clamp-1">{community.name}</h2>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase shrink-0 ${badgeStyles[community.tech]}`}>
                      {community.tech}
                    </span>
                  </div>
                  <p className="text-[#9E9E9E] text-xs leading-relaxed line-clamp-3 min-h-[48px] font-medium">
                    {community.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)] text-[10px] font-bold">
                  <div className="flex items-center gap-3 text-[#5C5C5C]">
                    <span className="flex items-center gap-1"><Users size={12} /> {community.memberCount}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
                    <span className={`flex items-center gap-1 ${community.liveCount.includes("Active") ? "text-[#5C5C5C]" : "text-[#6366F1]"}`}>
                      <Radio size={12} /> {community.liveCount}
                    </span>
                  </div>
                  <span className="text-[#9E9E9E] group-hover:text-white font-semibold transition-colors">
                    Open Circle ➔
                  </span>
                </div>
              </div>
            </Link>
          );
        })}

        {/* LAST CARD: Dashed Border 'Create Community' Card */}
        <Link
          href="/communities/create"
          className="block border border-dashed border-[rgba(255,255,255,0.16)] hover:border-[#6366F1]/50 bg-transparent rounded-2xl p-6 h-full min-h-[160px] flex flex-col items-center justify-center text-center group cursor-pointer transition-all hover:bg-[#111111]/10"
        >
          <Plus size={24} className="text-[#5C5C5C] group-hover:text-[#6366F1] transition-colors" />
          <h4 className="font-bold text-sm text-[#9E9E9E] group-hover:text-white mt-2">Create Community</h4>
          <p className="text-[10px] text-[#5C5C5C] mt-1 font-medium">Start a new developer circle</p>
        </Link>
      </div>

    </div>
  );
}
