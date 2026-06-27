import { getCommunities } from "@/src/services/community-services";
import { CommunityCard } from "@/src/components/community";
import Link from "next/link";

export const revalidate = 0; // Fresh database updates on refresh

export default async function CommunitiesPage() {
  const dbCommunities = await getCommunities();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-8 text-txt-primary">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-main pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-txt-primary tracking-tight">Communities</h1>
          <p className="text-sm text-txt-secondary">Discover and join stream circles of shared developer technologies.</p>
        </div>
        
        <Link
          href="/communities/create"
          className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs tracking-wider transition duration-200 cursor-pointer"
        >
          Create Community
        </Link>
      </div>

      {dbCommunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dbCommunities.map((community: any) => (
            <Link
              key={community.communityId}
              href={`/communities/${community.communityId}`}
              className="block cursor-pointer"
            >
              <CommunityCard
                name={community.name}
                description={community.description}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-border-main rounded-[14px] bg-card-bg p-16 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <span className="text-4xl block">👥</span>
          <h4 className="text-txt-primary font-bold text-lg">No communities found.</h4>
          <p className="text-txt-secondary text-xs">
            Start a community for Go, React, Python, or standard development environments.
          </p>
          <Link
            href="/communities/create"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs tracking-wider cursor-pointer transition duration-200"
          >
            Create the first community
          </Link>
        </div>
      )}
    </div>
  );
}