import { getStreamById } from "@/src/services/streams-services";
import { goLive, endStream } from "@/src/actions/stream-status-actions";
import AIAssistant from "@/src/components/ai/ai-assistant";
import StreamSummary from "@/src/components/ai/stream-summary";
import IVSPlayer from "@/src/components/stream/ivs-player";
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
      <h1 className="text-4xl font-bold">{stream.title}</h1>

      <p className="mt-4">{stream.description}</p>

      <div className="mt-6 flex gap-4">
        <form action={goLive.bind(null, stream.streamId)}>
          <button className="px-4 py-2 rounded border">Go Live</button>
        </form>

        <form action={endStream.bind(null, stream.streamId)}>
          <button className="px-4 py-2 rounded border">End Stream</button>
        </form>
      </div>

      <div className="mt-8 border rounded p-8">
        {stream.status === "LIVE" ? (
          <div>🔴 LIVE NOW</div>
        ) : stream.status === "ENDED" ? (
          <div>Stream Ended</div>
        ) : (
          <div>Stream Offline</div>
        )}
      </div>
      <div className="mt-6 border rounded p-4">
        <h2 className="font-bold mb-2">
          Streaming Information
        </h2>

        <p>
          <strong>Playback URL:</strong>
        </p>

        <p className="break-all text-sm">
          {stream.playbackUrl}
        </p>

        <br />

        <p>
          <strong>Stream Key:</strong>
        </p>

        <p className="break-all text-sm">
          {stream.streamKey}
        </p>
      </div>
      <div className="mt-8 border rounded p-4">
        {stream.playbackUrl ? (
          <IVSPlayer
            playbackUrl={stream.playbackUrl}
          />
        ) : (
          <div>No playback URL found</div>
        )}
      </div>

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
