import { getCommunityById } from "@/src/services/community-services";
import { getStreamsByCommunityId } from "@/src/services/streams-services";
import { LiveBadge } from "@/src/components/ui/live-badge";

import Link from "next/link";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ communityId: string }>;
}) {
  const { communityId } = await params;
  const streams = await getStreamsByCommunityId(communityId);

  const community = await getCommunityById(communityId);

  if (!community) {
    return <div className="p-8 text-primary">Community not found</div>;
  }

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
        <div className="space-y-3">
          <Link
            href="/communities"
            className="text-xs text-accent hover:text-violet-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            ← Back to Communities
          </Link>
          <h1 className="text-3xl font-bold text-primary tracking-tight">{community.name}</h1>
          <p className="text-sm text-secondary leading-relaxed max-w-2xl font-medium">{community.description}</p>
        </div>

        <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4">
            <h2 className="text-lg font-bold text-primary">Broadcast Sessions</h2>
            <Link
              href={`/communities/${communityId}/streams/create`}
              className="h-9 px-4 inline-flex items-center justify-center rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Create Stream
            </Link>
          </div>

          {streams.length === 0 ? (
            <div className="text-center py-8 text-muted text-sm font-medium">
              No stream sessions broadcasting in this circle yet.
            </div>
          ) : (
            <div className="divide-y divide-[rgba(255,255,255,0.08)]">
              {streams.map((stream: any) => {
                const isStreamLive = stream.status === "LIVE";
                return (
                  <Link
                    key={stream.streamId}
                    href={`/streams/${stream.streamId}`}
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-primary group-hover:text-accent transition-colors">
                        {stream.title}
                      </h3>
                      <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                        {stream.description || "No stream description provided."}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isStreamLive ? (
                        <LiveBadge />
                      ) : (
                        <span className="h-5 px-2 flex items-center bg-[#171717] border border-[rgba(255,255,255,0.08)] text-secondary font-mono font-medium text-[10px] uppercase rounded-full">
                          OFFLINE
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
