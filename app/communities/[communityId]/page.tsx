import { getCommunityById } from "@/src/services/community-services";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ communityId: string }>;
}) {
  const { communityId } = await params;

  const community = await getCommunityById(
    communityId
  );

  if (!community) {
    return (
      <div className="p-8">
        Community not found
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">
        {community.name}
      </h1>

      <p className="mt-4 text-gray-600">
        {community.description}
      </p>

      <div className="mt-8 border rounded-lg p-6">
        <h2 className="text-2xl font-semibold">
          Streams
        </h2>

        <p className="mt-2 text-gray-500">
          No streams yet.
        </p>
      </div>
    </div>
  );
}