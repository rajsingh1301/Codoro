import React from "react";
import HomeClient from "@/src/components/stream/home-client";
import { getAllStreams } from "@/src/services/streams-services";
import { getCommunities } from "@/src/services/community-services";

export const revalidate = 0; // Disable server component caching to ensure live statuses update immediately on refresh

export default async function HomePage() {
  // Query all initial stream and community data from DynamoDB
  const streamsData = await getAllStreams();
  const communitiesData = await getCommunities();

  // Map to structured client models safely
  const streams = streamsData.map((s: any) => ({
    streamId: s.streamId,
    title: s.title,
    description: s.description || "",
    creatorName: s.creatorName,
    creatorImage: s.creatorImage || "",
    status: s.status || "OFFLINE",
    viewCount: s.viewCount || 0,
    createdAt: s.createdAt,
    communityId: s.communityId || "",
  }));

  const communities = communitiesData.map((c: any) => ({
    communityId: c.communityId,
    name: c.name,
    description: c.description || "",
    ownerId: c.ownerId,
    ownerName: c.ownerName,
    ownerImage: c.ownerImage || "",
    createdAt: c.createdAt,
  }));

  return (
    <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10">
      <HomeClient initialStreams={streams} initialCommunities={communities} />
    </main>
  );
}
