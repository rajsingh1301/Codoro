import { getStreamById, getAllStreams } from "@/src/services/streams-services";
import { goLive, endStream } from "@/src/actions/stream-status-actions";
import Link from "next/link";

import AIAssistant from "@/src/components/ai/ai-assistant";
import StreamSummary from "@/src/components/ai/stream-summary";

import ViewTracker from "@/src/components/stream/view-tracker";
import LiveChat from "@/src/components/stream/live-chat";
import LiveViewerTracker from "@/src/components/stream/live-viewer-tracker";
import StreamPlayerWrapper from "@/src/components/stream/stream-player-wrapper";
import CreatorDashboard from "@/src/components/stream/creator-dashboard";
import { getCurrentUser } from "@/src/lib/auth/current-user";
import { GetChannelCommand } from "@aws-sdk/client-ivs";
import { ivsClient } from "@/src/lib/ivs/client";
import { getCommunities, getCommunityById } from "@/src/services/community-services";
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
    return <div>Stream not found</div>;
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

  if (isCreator) {
    return (
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
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6 text-txt-primary">
      <div className="space-y-1.5">
        <Link
          href="/streams"
          className="text-xs text-brand hover:text-brand-hover font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          ← Back to Streams
        </Link>
      </div>

      <ViewTracker streamId={stream.streamId} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Player & Stream Info */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-card-bg border border-border-main rounded-[14px] p-5 shadow-sm">
            <StreamPlayerWrapper
              streamId={stream.streamId}
              playbackUrl={stream.playbackUrl || ""}
              initialStatus={stream.status as any}
            />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight text-txt-primary">{stream.title}</h1>
            
            <LiveViewerTracker 
              streamId={stream.streamId} 
              totalViews={stream.viewCount ?? 0} 
              userId={user?.id || ""} 
            />

            <p className="text-txt-secondary text-sm leading-relaxed">{stream.description}</p>
          </div>

          {/* AI Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AIAssistant
              streamTitle={stream.title}
              streamDescription={stream.description}
            />

            <StreamSummary
              streamTitle={stream.title}
              streamDescription={stream.description}
            />
          </div>
        </div>

        {/* Right Column: Chat Client */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
          <div className="bg-card-bg border border-border-main rounded-[14px] overflow-hidden shadow-sm h-[480px] flex flex-col">
            <div className="border-b border-border-main px-5 py-4">
              <span className="text-xs font-bold uppercase text-txt-secondary tracking-wider">Live Chat Room</span>
            </div>
            <div className="flex-grow overflow-hidden flex flex-col">
              <LiveChat streamId={stream.streamId} currentUser={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
