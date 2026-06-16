import { getStreamById } from "@/src/services/streams-services";
import { goLive, endStream } from "@/src/actions/stream-status-actions";
import AIAssistant from "@/src/components/ai/ai-assistant";
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
      <div className="mt-8 border rounded p-8">Live Chat Coming Soon</div>

      <div className="mt-8">
        <AIAssistant />
      </div>
    </div>
  );
}
