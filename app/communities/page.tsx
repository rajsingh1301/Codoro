import { getCommunities } from "@/src/services/community-services";
import { CommunitiesClient } from "@/src/components/community";

export const revalidate = 0; // Fresh database updates on refresh

export default async function CommunitiesPage() {
  const dbCommunities = await getCommunities();

  return (
    <div className="min-h-screen w-full relative">
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
      <div className="relative z-10 w-full flex flex-col">
        <CommunitiesClient dbCommunities={dbCommunities as any} />
      </div>
    </div>
  );
}