import { communities } from "@/src/lib/mock-data/communities";
import { CommunityCard } from "@/src/components/community";
import Link from "next/link";

export default function CommunitiesPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Communities
      </h1>

      <div className="grid gap-4">
        {communities.map((community) => (
          <Link
            key={community.communityId}
            href={`/communities/${community.communityId}`}
            className="block hover:opacity-90 transition-opacity"
          >
            <CommunityCard
              name={community.name}
              description={community.description}
            />
          </Link>
        ))}

      </div>
    </div>
  );
}