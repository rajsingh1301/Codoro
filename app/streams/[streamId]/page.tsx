import { getStreamById } from "@/src/services/streams-services";
import { goLive, endStream } from "@/src/actions/stream-status-actions";

import AIAssistant from "@/src/components/ai/ai-assistant";
import StreamSummary from "@/src/components/ai/stream-summary";

import IVSPlayer from "@/src/components/stream/ivs-player";
import CopyButton from "@/src/components/stream/copy-button";
import LiveStatus from "@/src/components/stream/live-status";
import ViewTracker from "@/src/components/stream/view-tracker";

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

  return (
    <div className="p-8">
      <ViewTracker streamId={stream.streamId} />
      <h1 className="text-4xl font-bold">{stream.title}</h1>

      <p className="mt-2 text-sm text-gray-500">
        👁 {stream.viewCount ?? 0} Viewers
      </p>

      <p className="mt-4">{stream.description}</p>

      <div className="mt-6 flex gap-4">
        <form action={goLive.bind(null, stream.streamId)}>
          <button className="px-4 py-2 rounded border">Go Live</button>
        </form>

        <form action={endStream.bind(null, stream.streamId)}>
          <button className="px-4 py-2 rounded border">End Stream</button>
        </form>
      </div>

      {/* Auto Refreshing Live Status */}
      <LiveStatus streamId={stream.streamId} />

      {/* Creator Controls */}
      <div className="mt-6 border rounded p-4">
        <h2 className="font-bold text-lg mb-4">Creator Controls</h2>

        <div className="space-y-4">
          <div>
            <p className="font-medium">Playback URL</p>

            <div className="flex gap-2 items-center">
              <p className="flex-1 break-all text-sm">{stream.playbackUrl}</p>

              <CopyButton text={stream.playbackUrl} />
            </div>
          </div>

          <div>
            <p className="font-medium">Stream Key</p>

            <div className="flex gap-2 items-center">
              <p className="flex-1 break-all text-sm">{stream.streamKey}</p>

              <CopyButton text={stream.streamKey} />
            </div>
          </div>

          <div>
            <p className="font-medium">Channel ARN</p>

            <div className="flex gap-2 items-center">
              <p className="flex-1 break-all text-sm">{stream.channelArn}</p>

              <CopyButton text={stream.channelArn} />
            </div>
          </div>
        </div>
      </div>

      {/* OBS Setup */}
      <div className="mt-6 border rounded p-4">
        <h2 className="font-bold mb-4">OBS Setup</h2>

        <p className="text-sm font-medium">Server</p>

        <code className="block mt-2 break-all">
          rtmps://global-contribute.live-video.net:443/app/
        </code>

        <p className="text-sm font-medium mt-4">Stream Key</p>

        <code className="block mt-2 break-all">{stream.streamKey}</code>
      </div>

      {/* Video Player */}
      <div className="mt-8 border rounded p-4">
        {stream.playbackUrl ? (
          <IVSPlayer playbackUrl={stream.playbackUrl} />
        ) : (
          <div>No playback URL found</div>
        )}
      </div>

      {/* AI Features */}
      <div className="mt-8">
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
  );
}
