import { getCommunityById } from "@/src/services/community-services";
import { getStreamsByCommunityId } from "@/src/services/streams-services";

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
    return <div className="p-8">Community not found</div>;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-8 text-txt-primary">
      <div className="space-y-1.5">
        <Link
          href="/communities"
          className="text-xs text-brand hover:text-brand-hover font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          ← Back to Communities
        </Link>
        <h1 className="text-3xl font-extrabold text-txt-primary tracking-tight mt-2">{community.name}</h1>
        <p className="text-sm text-txt-secondary leading-relaxed max-w-2xl">{community.description}</p>
      </div>

      <div className="bg-card-bg border border-border-main rounded-[14px] p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-txt-primary">Broadcast Sessions</h2>
          <Link
            href={`/communities/${communityId}/streams/create`}
            className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs tracking-wider transition duration-200 cursor-pointer"
          >
            Create Stream
          </Link>
        </div>

        {streams.length === 0 ? (
          <div className="text-center py-8 text-txt-muted text-xs font-medium">
            No stream sessions broadcasting in this circle yet.
          </div>
        ) : (
          <div className="space-y-4">
            {streams.map((stream: any) => {
              const isStreamLive = stream.status === "LIVE";
              return (
                <Link
                  key={stream.streamId}
                  href={`/streams/${stream.streamId}`}
                  className="group block border border-border-main p-4 rounded-xl bg-surface hover:border-brand/40 transition duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-txt-primary group-hover:text-brand transition">
                        {stream.title}
                      </h3>
                      <p className="text-xs text-txt-secondary leading-relaxed line-clamp-2">
                        {stream.description || "No stream description provided."}
                      </p>
                    </div>

                    <div>
                      {isStreamLive ? (
                        <span className="inline-flex items-center gap-1.5 bg-rose-600/90 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-xl">
                          LIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-card-bg border border-border-main text-txt-secondary font-bold text-[9px] uppercase px-2 py-0.5 rounded-xl">
                          OFFLINE
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
