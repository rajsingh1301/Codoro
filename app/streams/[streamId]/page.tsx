import { getStreamById } from "@/src/services/streams-services";

export default async function StreamPage({
  params,
}: {
  params: Promise<{ streamId: string }>;
}) {
  const { streamId } = await params;

  const stream = await getStreamById(streamId);

  if (!stream) {
    return <div>Stream not found</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">{stream.title}</h1>

      <p className="mt-4">{stream.description}</p>

      <div className="mt-8 border rounded p-8">
        Live Stream Player Coming Soon
      </div>

      <div className="mt-8 border rounded p-8">Live Chat Coming Soon</div>
    </div>
  );
}
