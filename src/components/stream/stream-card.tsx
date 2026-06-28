import React from "react";
import Link from "next/link";
import { LiveBadge } from "../ui/live-badge";
import { ViewerCount } from "./viewer-count";

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

type Props = {
  stream: Stream;
  communityName?: string;
};

// Map tech/community names to syntax colors
function getTagColorClass(tagName: string) {
  const name = tagName.toLowerCase();
  if (name.includes("react")) return "bg-syntax-blue/10 text-syntax-blue border-syntax-blue/20";
  if (name.includes("go") || name.includes("kubernetes")) return "bg-syntax-blue/10 text-syntax-blue border-syntax-blue/20";
  if (name.includes("python")) return "bg-syntax-green/10 text-syntax-green border-syntax-green/20";
  if (name.includes("ai") || name.includes("llm")) return "bg-accent/10 text-accent border-accent/20";
  if (name.includes("devops") || name.includes("rust")) return "bg-syntax-orange/10 text-syntax-orange border-syntax-orange/20";
  
  // Default fallback (violet/accent)
  return "bg-accent-dim/10 text-accent border-accent-dim/30";
}

export default function StreamCard({ stream, communityName }: Props) {
  const isLive = stream.status === "LIVE";
  const tagColor = getTagColorClass(communityName || "");

  return (
    <Link 
      href={`/streams/${stream.streamId}`}
      className="group flex flex-col h-full bg-surface border border-border hover:border-border-bright rounded-lg overflow-hidden transition-all duration-150 ease-out hover:shadow-[0_0_0_1px_#7C3AED33,0_4px_20px_#7C3AED15] cursor-pointer"
    >
      {/* Thumbnail Aspect Container */}
      <div className="relative aspect-video w-full bg-base overflow-hidden border-b border-border">
        {/* Dynamic Gradient Thumbnail Cover (Subtle) */}
        <div className="absolute inset-0 bg-base flex flex-col items-center justify-center transition-transform duration-150 ease-out group-hover:scale-[1.02] select-none p-4">
           {/* Replace neon gradient with a dark tech pattern or subtle logo */}
           <span className="font-mono text-muted text-xs font-semibold tracking-widest opacity-30">
             {stream.streamId.substring(0, 8).toUpperCase()}
           </span>
        </div>

        {/* Top Left: Live / Offline Status Overlay */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {isLive ? (
            <LiveBadge />
          ) : (
            <span className="bg-elevated text-muted border border-border h-5 px-2 rounded-full font-mono text-[10px] font-medium uppercase flex items-center justify-center">
              OFFLINE
            </span>
          )}
        </div>

        {/* Top Right: View Count Overlay */}
        {isLive && stream.viewCount !== undefined && (
          <div className="absolute top-3 right-3 z-10 bg-elevated/90 px-2 py-0.5 rounded-full border border-border">
            <ViewerCount count={stream.viewCount} />
          </div>
        )}
      </div>

      {/* Info Content Section */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        
        {/* Title (No Truncation) */}
        <h4 className="text-primary font-bold text-sm group-hover:text-accent transition-colors duration-150 ease-out leading-snug">
          {stream.title}
        </h4>

        {/* Creator Identity Footer */}
        <div className="flex items-center gap-3 pt-2">
          {stream.creatorImage ? (
            <img
              src={stream.creatorImage}
              alt={stream.creatorName}
              className="h-6 w-6 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-elevated border border-border flex items-center justify-center text-[10px] font-bold text-secondary">
              {stream.creatorName[0].toUpperCase()}
            </div>
          )}
          
          <div className="flex flex-col flex-1">
            <span className="text-secondary text-xs font-medium">
              {stream.creatorName.startsWith("@") ? stream.creatorName : `@${stream.creatorName.toLowerCase().replace(/ /g, "")}`}
            </span>
          </div>

          {/* Community Tag */}
          {communityName && (
            <span className={`h-5 px-2 rounded-full text-xs font-medium font-mono border ${tagColor} flex items-center justify-center`}>
              {communityName}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Reusable Skeleton loader for Grid placement
export function StreamCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden">
      {/* Thumbnail Skeleton */}
      <div className="aspect-video w-full bg-base border-b border-border relative">
        <div className="absolute top-3 left-3 h-5 w-16 bg-elevated rounded-full border border-border" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-3 pt-1">
          <div className="h-4 w-full bg-elevated rounded-md" />
          <div className="h-4 w-4/5 bg-elevated rounded-md" />
        </div>

        {/* Creator Info Skeleton */}
        <div className="flex items-center gap-3 pt-2">
          <div className="h-6 w-6 rounded-full bg-elevated border border-border" />
          <div className="h-3 w-24 bg-elevated rounded-md flex-1" />
          <div className="h-5 w-16 bg-elevated rounded-full border border-border" />
        </div>
      </div>
    </div>
  );
}
