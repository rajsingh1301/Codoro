import { createStream } from "@/src/actions/stream-actions";
import Link from "next/link";

export default async function CreateStreamPage({
  params,
}: {
  params: Promise<{ communityId: string }>;
}) {
  const { communityId } = await params;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-6 text-primary">
      <div className="space-y-1">
        <Link
          href={`/communities/${communityId}`}
          className="text-xs text-accent hover:text-violet-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          ← Back to Community
        </Link>
        <h1 className="text-3xl font-bold text-primary tracking-tight mt-2">
          Create Stream
        </h1>
      </div>

      <form action={createStream} className="space-y-6 max-w-xl bg-surface border border-border rounded-lg p-6">
        <input
          type="hidden"
          name="communityId"
          value={communityId}
        />

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider block">
            Stream Title
          </label>
          <input
            name="title"
            placeholder="e.g. Building a Compiler in TypeScript"
            className="w-full h-9 px-3 bg-base border border-border focus:border-border-bright focus:ring-1 focus:ring-accent focus:ring-opacity-30 rounded-md text-primary text-sm placeholder:text-muted outline-none transition-colors"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider block">
            Stream Description
          </label>
          <textarea
            name="description"
            placeholder="Describe what you will build during this broadcast..."
            rows={4}
            className="w-full p-3 bg-base border border-border focus:border-border-bright focus:ring-1 focus:ring-accent focus:ring-opacity-30 rounded-md text-primary text-sm placeholder:text-muted outline-none transition-colors resize-none"
            required
          />
        </div>

        <div className="border-t border-border pt-6 flex justify-end">
          <button
            type="submit"
            className="h-9 px-4 rounded-md bg-accent hover:bg-violet-600 text-white font-medium text-sm transition-colors cursor-pointer"
          >
            Create Stream
          </button>
        </div>
      </form>
    </div>
  );
}