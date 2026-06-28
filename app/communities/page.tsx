import { getCommunities } from "@/src/services/community-services";
import { CommunitiesClient } from "@/src/components/community";

export const revalidate = 0; // Fresh database updates on refresh

export default async function CommunitiesPage() {
  const dbCommunities = await getCommunities();

  return (
    <div className="w-full bg-[#08080F] z-10 relative min-h-[calc(100vh-64px)] flex flex-col">
      <CommunitiesClient dbCommunities={dbCommunities as any} />
    </div>
  );
}