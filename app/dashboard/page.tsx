import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth/current-user";
import { getAllStreams } from "@/src/services/streams-services";
import { getCommunities } from "@/src/services/community-services";
import DashboardClient from "@/src/components/dashboard/dashboard-client";

export const revalidate = 0; // Fresh database updates on refresh

export default async function DashboardPage() {
  // 1. Authenticate user
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  // 2. Fetch all streams and communities
  const streamsData = await getAllStreams();
  const communitiesData = await getCommunities();

  // 3. Filter by current logged-in creator
  const streams = streamsData
    .filter((s: any) => s.creatorId === user.id)
    .map((s: any) => ({
      streamId: s.streamId,
      title: s.title,
      description: s.description || "",
      creatorName: s.creatorName,
      creatorImage: s.creatorImage || "",
      status: s.status || "OFFLINE",
      viewCount: s.viewCount || 0,
      createdAt: s.createdAt,
      communityId: s.communityId || "",
      streamKey: s.streamKey || "",
      playbackUrl: s.playbackUrl || "",
    }));

  const communities = communitiesData
    .filter((c: any) => c.ownerId === user.id)
    .map((c: any) => ({
      communityId: c.communityId,
      name: c.name,
      description: c.description || "",
      ownerId: c.ownerId,
      ownerName: c.ownerName,
      ownerImage: c.ownerImage || "",
      createdAt: c.createdAt,
    }));

  return (
    <div className="min-h-screen w-full relative text-white font-sans">
      {/* Dark Dot Matrix */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#0a0a0a',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
            radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
          imageRendering: 'pixelated',
        }}
      />
      {/* existing page content — relative z-10 lagao taaki content dot matrix ke upar rahe */}
      <div className="relative z-10">
        <DashboardClient user={user} streams={streams} communities={communities} />
      </div>
    </div>
  );
}
