import { createStream } from "@/src/actions/stream-actions";

export default async function CreateStreamPage({
  params,
}: {
  params: Promise<{ communityId: string }>;
}) {
  const { communityId } = await params;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create Stream
      </h1>

      <form action={createStream} className="space-y-4">
        <input
          type="hidden"
          name="communityId"
          value={communityId}
        />

        <input
          name="title"
          placeholder="Stream Title"
          className="w-full border p-3 rounded"
        />

        <textarea
          name="description"
          placeholder="Stream Description"
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="border px-4 py-2 rounded"
        >
          Create Stream
        </button>
      </form>
    </div>
  );
}