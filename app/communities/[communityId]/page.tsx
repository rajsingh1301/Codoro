import { use } from "react";

interface CommunityDetailsPageProps {
  params: Promise<{
    communityId: string;
  }>;
}

export default function CommunityDetailsPage({ params }: CommunityDetailsPageProps) {
  const resolvedParams = use(params);
  const communityId = resolvedParams.communityId;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">Community Details Page</h1>
      <p className="text-zinc-500">Viewing community: {communityId}</p>
    </div>
  );
}
