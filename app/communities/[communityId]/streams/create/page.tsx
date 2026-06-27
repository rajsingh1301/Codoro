import { createStream } from "@/src/actions/stream-actions";
import Link from "next/link";

export default async function CreateStreamPage({
  params,
}: {
  params: Promise<{ communityId: string }>;
}) {
  const { communityId } = await params;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-6 text-txt-primary">
      <div className="space-y-1">
        <Link
          href={`/communities/${communityId}`}
          className="text-xs text-brand hover:text-brand-hover font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          ← Back to Community
        </Link>
        <h1 className="text-3xl font-extrabold text-txt-primary tracking-tight mt-2">
          Create Stream
        </h1>
      </div>

      <form action={createStream} className="space-y-6 max-w-xl bg-card-bg border border-border-main rounded-[14px] p-6 shadow-sm">
        <input
          type="hidden"
          name="communityId"
          value={communityId}
        />

        <div className="space-y-2">
          <label className="text-xs font-bold text-txt-secondary uppercase tracking-wider block">
            Stream Title
          </label>
          <input
            name="title"
            placeholder="e.g. Building a Compiler in TypeScript"
            className="w-full px-4 py-2.5 bg-surface border border-border-main focus:border-brand/45 rounded-xl text-txt-primary text-xs placeholder:text-txt-muted outline-none transition duration-200"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-txt-secondary uppercase tracking-wider block">
            Stream Description
          </label>
          <textarea
            name="description"
            placeholder="Describe what you will build during this broadcast..."
            rows={4}
            className="w-full px-4 py-2.5 bg-surface border border-border-main focus:border-brand/45 rounded-xl text-txt-primary text-xs placeholder:text-txt-muted outline-none transition duration-200 resize-none"
            required
          />
        </div>

        <div className="border-t border-border-main pt-6 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs tracking-wider transition duration-200 cursor-pointer"
          >
            Create Stream
          </button>
        </div>
      </form>
    </div>
  );
}