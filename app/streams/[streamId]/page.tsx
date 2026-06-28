import { getStreamById, getAllStreams } from "@/src/services/streams-services";
import { getCurrentUser } from "@/src/lib/auth/current-user";
import { GetChannelCommand } from "@aws-sdk/client-ivs";
import { ivsClient } from "@/src/lib/ivs/client";
import { getCommunities, getCommunityById } from "@/src/services/community-services";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ShareButton from "@/src/components/stream/share-button";
import FloatingActionPill from "@/src/components/stream/floating-action-pill";

import AIAssistant from "@/src/components/ai/ai-assistant";
import StreamSummary from "@/src/components/ai/stream-summary";
import StreamSummaryDrawer from "@/src/components/ai/stream-summary-drawer";
import ViewTracker from "@/src/components/stream/view-tracker";
import LiveChat from "@/src/components/stream/live-chat";
import LiveViewerTracker from "@/src/components/stream/live-viewer-tracker";
import StreamPlayerWrapper from "@/src/components/stream/stream-player-wrapper";
import CreatorStudioView from "@/src/components/stream/creator-studio-view";

export default async function StreamPage({
  params,
}: {
  params: Promise<{ streamId: string }>;
}) {
  const { streamId } = await params;

  console.log("STREAM ID:", streamId);

  const stream = await getStreamById(streamId);

  if (!stream) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Stream Not Found</h2>
        <Link href="/streams" className="text-sm text-[#6366F1] hover:underline">
          Go back to streams
        </Link>
      </div>
    );
  }

  const user = await getCurrentUser();
  const isCreator = !!(user && stream.creatorId === user.id);

  // Fetch the channel details dynamically from AWS IVS to get the ingest endpoint
  let ingestEndpoint = "";
  if (stream.channelArn) {
    try {
      const channelRes = await ivsClient.send(
        new GetChannelCommand({
          arn: stream.channelArn,
        })
      );
      ingestEndpoint = channelRes.channel?.ingestEndpoint || "";
    } catch (err) {
      console.error("Failed to fetch channel details from IVS:", err);
    }
  }

  // Load community name if stream belongs to one
  let communityName = "";
  if (stream.communityId) {
    const community = await getCommunityById(stream.communityId);
    if (community) {
      communityName = community.name;
    }
  }

  // Load stats and stream list for creator
  let totalStreamsCount = 0;
  let communitiesCount = 0;
  let creatorStreams: any[] = [];
  if (isCreator && user) {
    const allStreams = await getAllStreams();
    creatorStreams = allStreams.filter((s: any) => s.creatorId === user.id);
    totalStreamsCount = creatorStreams.length;

    const allCommunities = await getCommunities();
    communitiesCount = allCommunities.filter((c: any) => c.ownerId === user.id).length;
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
      <div className="relative z-10">
        {isCreator ? (
          <>
            <ViewTracker streamId={stream.streamId} />
            <CreatorStudioView
              stream={stream as any}
              user={user}
              ingestEndpoint={ingestEndpoint}
              communityName={communityName}
              totalStreamsCount={totalStreamsCount}
              communitiesCount={communitiesCount}
              creatorStreams={creatorStreams}
            />
          </>
        ) : (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6 text-primary relative pb-28">
            
            {/* Back navigation */}
            <div className="flex items-center justify-between">
              <Link
                href="/streams"
                className="text-xs text-[#9E9E9E] hover:text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={14} /> Back to Streams
              </Link>
            </div>

            <ViewTracker streamId={stream.streamId} />

            {/* Main split grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Player, details and AI widgets */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Frameless Player wrapper */}
                <div className="border border-[rgba(255,255,255,0.08)] bg-[#111111] rounded-2xl overflow-hidden shadow-sm">
                  <StreamPlayerWrapper
                    streamId={stream.streamId}
                    playbackUrl={stream.playbackUrl || ""}
                    initialStatus={stream.status as any}
                  />
                </div>

                {/* Details Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-2">
                  <div className="space-y-3">
                    <h1 className="text-2xl font-bold tracking-tight text-white">{stream.title}</h1>
                    
                    <div className="flex items-center gap-4 text-xs font-mono font-medium text-[#9E9E9E]">
                      <LiveViewerTracker 
                        streamId={stream.streamId} 
                        totalViews={stream.viewCount ?? 0} 
                        userId={user?.id || ""} 
                        status={stream.status || ""}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                    <ShareButton />
                    {stream.status !== "ENDED" && (
                      <StreamSummaryDrawer
                        streamTitle={stream.title}
                        streamDescription={stream.description || ""}
                      />
                    )}
                  </div>
                </div>
                
                <div className="border-b border-[rgba(255,255,255,0.08)]" />
                
                <p className="text-sm text-[#9E9E9E] leading-relaxed max-w-3xl font-medium">
                  {stream.description || "No stream description provided."}
                </p>

                {stream.status === "ENDED" && (
                  <div className="mt-8 border-t border-[rgba(255,255,255,0.08)] pt-6">
                    <h2 className="text-xl font-bold text-white mb-4">Session Summary</h2>
                    <StreamSummary
                      streamId={stream.streamId}
                      streamTitle={stream.title}
                      streamDescription={stream.description || ""}
                      initialSummary={stream.summary}
                    />
                  </div>
                )}

                {/* AI Assistant Tool */}
                <div className="pt-2">
                  <AIAssistant
                    streamTitle={stream.title}
                    streamDescription={stream.description || ""}
                  />
                </div>

              </div>

              {/* Right Column: Full-height Live Chat */}
              <div className="lg:col-span-4 lg:sticky lg:top-8 h-[550px] lg:h-[750px] shrink-0">
                <LiveChat streamId={stream.streamId} currentUser={user} />
              </div>

            </div>

            <FloatingActionPill />

          </div>
        )}
      </div>
    </div>
  );
}
