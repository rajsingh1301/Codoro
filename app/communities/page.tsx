import { communities } from "@/src/lib/mock-data/communities";
import { CommunityCard } from "@/src/components/community";

export default function CommunitiesPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Communities
      </h1>

      <div className="grid gap-4">
        {communities.map((community) => (
          <CommunityCard
            key={community.communityId}
            name={community.name}
            description={community.description}
          />
        ))}
      </div>
    </div>
  );
}