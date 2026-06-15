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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">{community.name}</h1>

      <p className="mt-4 text-gray-600">{community.description}</p>

      <div className="mt-8 border rounded-lg p-6">
        <h2 className="text-2xl font-semibold">Streams</h2>

        {streams.length === 0 ? (
          <p className="mt-2 text-gray-500">No streams yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {streams.map((stream: any) => (
             <Link

  key={stream.streamId}

  href={`/streams/${stream.streamId}`}

  className="block border p-3 rounded hover:bg-gray-50"

>
                <h3 className="font-semibold">{stream.title}</h3>

                <p className="text-sm text-gray-600">{stream.description}</p>

                <p className="text-xs mt-2">Status: {stream.status}</p>
              </Link>
            ))}
          </div>
        )}

        <Link
          href={`/communities/${communityId}/streams/create`}
          className="inline-block mt-6 border px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Create Stream
        </Link>
      </div>
    </div>
  );
}
