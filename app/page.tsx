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
    <div 
      className="w-full"
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse 80% 60% at 50% 40%, #7c3200 0%, #3d1a00 25%, #0a0a0a 60%),
          radial-gradient(ellipse 60% 80% at 50% 100%, #5a2400 0%, #0a0a0a 50%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10">
        <HomeClient initialStreams={streams} initialCommunities={communities} />
      </div>
    </div>
  );
}
