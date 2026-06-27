import React from "react";
import Link from "next/link";

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

function getGradientFromTitle(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradients = [
    "from-indigo-900 to-purple-800",
    "from-violet-900 to-fuchsia-800",
    "from-rose-900 to-amber-700",
    "from-emerald-900 to-teal-800",
    "from-cyan-900 to-blue-800",
    "from-purple-900 to-pink-700",
    "from-slate-800 to-slate-900",
    "from-blue-900 to-indigo-800",
  ];
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export default function StreamCard({ stream, communityName }: Props) {
  const isLive = stream.status === "LIVE";
  const gradientClass = getGradientFromTitle(stream.title);

  return (
    <Link 
      href={`/streams/${stream.streamId}`}
      className="group flex flex-col h-full bg-card-bg hover:bg-card-bg border border-border-main hover:border-brand/40 rounded-[14px] overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Thumbnail Aspect Container */}
      <div className="relative aspect-video w-full bg-[#0a0a0a] overflow-hidden">
        {/* Dynamic Gradient Thumbnail Cover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex flex-col justify-between p-4 transition-transform duration-300 group-hover:scale-[1.01] select-none`}>
          {/* Logo overlay */}
          <div className="flex items-center justify-between text-white/40 text-[9px] font-bold tracking-wider uppercase">
            <span>CodeLive Space</span>
            <span>💻</span>
          </div>

          <div className="my-auto text-center px-2">
            <h5 className="text-white font-extrabold text-xs sm:text-sm tracking-wide drop-shadow-md line-clamp-2">
              {stream.title}
            </h5>
          </div>

          <div className="flex items-center gap-1.5 text-white/40 text-[9px] font-bold uppercase tracking-wider">
            <span>By {stream.creatorName}</span>
          </div>
        </div>

        {/* Live / Offline Status Overlay */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {isLive ? (
            <span className="flex items-center gap-1.5 bg-rose-600/90 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-xl shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE
            </span>
          ) : (
            <span className="bg-surface/90 text-txt-secondary border border-border-main font-bold text-[10px] uppercase px-2.5 py-1 rounded-xl">
              OFFLINE
            </span>
          )}
        </div>

        {/* View Count Overlay */}
        {isLive && stream.viewCount !== undefined && (
          <div className="absolute bottom-3 right-3 z-10 bg-surface/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-xl border border-border-main">
            👤 {stream.viewCount} {stream.viewCount === 1 ? 'viewer' : 'viewers'}
          </div>
        )}
      </div>

      {/* Info Content Section */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-2">
          {/* Community Tag */}
          {communityName && (
            <span className="inline-block text-[10px] font-bold tracking-wider text-brand uppercase bg-brand/10 px-2.5 py-0.5 rounded-full border border-brand/20">
              {communityName}
            </span>
          )}

          {/* Title */}
          <h4 className="text-txt-primary font-bold text-sm line-clamp-1 group-hover:text-brand transition duration-200">
            {stream.title}
          </h4>

          {/* Description */}
          {stream.description && (
            <p className="text-txt-secondary text-xs line-clamp-2 leading-relaxed">
              {stream.description}
            </p>
          )}
        </div>

        {/* Creator Identity Footer */}
        <div className="flex items-center gap-3 border-t border-border-main pt-4">
          {stream.creatorImage ? (
            <img
              src={stream.creatorImage}
              alt={stream.creatorName}
              className="h-7 w-7 rounded-full object-cover border border-border-main"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-brand/10 border border-brand/25 flex items-center justify-center text-[10px] font-bold text-brand">
              {stream.creatorName[0].toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-txt-primary text-xs font-semibold group-hover:text-brand transition">
              {stream.creatorName}
            </span>
            <span className="text-[10px] text-txt-muted font-medium">
              {(() => {
                try {
                  const parts = stream.createdAt.split("T")[0].split("-");
                  const year = parts[0];
                  const monthIndex = parseInt(parts[1], 10) - 1;
                  const day = parseInt(parts[2], 10);
                  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  return `${months[monthIndex]} ${day}, ${year}`;
                } catch (e) {
                  return stream.createdAt;
                }
              })()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Reusable Skeleton loader for Grid placement
export function StreamCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-slate-900/20 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="aspect-video w-full bg-slate-800/40 relative">
        <div className="absolute top-3 left-3 h-5 w-12 bg-slate-800 rounded-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-3">
          <div className="h-4 w-20 bg-slate-800 rounded-full" />
          <div className="h-4 w-full bg-slate-800 rounded" />
          <div className="h-3 w-4/5 bg-slate-800/60 rounded" />
        </div>

        {/* Creator Info Skeleton */}
        <div className="flex items-center gap-3 border-t border-white/5 pt-4">
          <div className="h-7 w-7 rounded-full bg-slate-800" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-20 bg-slate-800 rounded" />
            <div className="h-2 w-12 bg-slate-800/60 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
