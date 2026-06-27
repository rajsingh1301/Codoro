import { getStreamById } from "@/src/services/streams-services";
import { goLive, endStream } from "@/src/actions/stream-status-actions";

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

  return (
    <div className="p-8 max-w-[1600px] mx-auto font-sans">
      <ViewTracker streamId={stream.streamId} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Player & Stream Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Dynamic Video Player or Placeholder */}
          <StreamPlayerWrapper
            streamId={stream.streamId}
            playbackUrl={stream.playbackUrl || ""}
            initialStatus={stream.status as any}
          />

          <div>
            <h1 className="text-4xl font-bold text-white">{stream.title}</h1>
            
            <LiveViewerTracker 
              streamId={stream.streamId} 
              totalViews={stream.viewCount ?? 0} 
              userId={user?.id || ""} 
            />

            <p className="mt-4 text-slate-300 leading-relaxed">{stream.description}</p>
          </div>

          {isCreator && (
            <div className="flex gap-4">
              <form action={goLive.bind(null, stream.streamId)}>
                <button className="px-5 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white font-medium transition duration-200 cursor-pointer">
                  Go Live
                </button>
              </form>

              <form action={endStream.bind(null, stream.streamId)}>
                <button className="px-5 py-2.5 rounded-xl border border-rose-500/30 bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white font-medium transition duration-200 cursor-pointer">
                  End Stream
                </button>
              </form>
            </div>
          )}

          {/* Interactive Creator Ingestion Controls & In-depth Guide */}
          {isCreator && (
            <CreatorDashboard
              streamId={stream.streamId}
              playbackUrl={stream.playbackUrl || ""}
              streamKey={stream.streamKey || ""}
              channelArn={stream.channelArn || ""}
              ingestEndpoint={ingestEndpoint}
            />
          )}

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
          <LiveChat streamId={stream.streamId} currentUser={user} />
        </div>
      </div>
    </div>
  );
}

