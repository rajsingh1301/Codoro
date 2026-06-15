import { getCommunities } from "@/src/services/community-services";
import Link from "next/link";

export default async function CommunitiesPage() {
  const communities = await getCommunities();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Communities
      </h1>

      <div className="space-y-4">
        {communities.map((community: any) => (
          <Link
            key={community.communityId}
            href={`/communities/${community.communityId}`}
            className="block border p-4 rounded hover:bg-gray-50 transition"
          >
            <h2 className="font-semibold text-lg">
              {community.name}
            </h2>

            <p className="text-gray-600">
              {community.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}