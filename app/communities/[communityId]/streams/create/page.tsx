import { createStream } from "@/src/actions/stream-actions";
import Link from "next/link";

export default async function CreateStreamPage({
  params,
}: {
  params: Promise<{ communityId: string }>;
}) {
  const { communityId } = await params;

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
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-6 text-primary">
        <div className="space-y-1">
          <Link
            href={`/communities/${communityId}`}
            className="text-xs text-[#6366F1] hover:text-indigo-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            ← Back to Community
          </Link>
          <h1 className="text-3xl font-bold text-primary tracking-tight mt-2">
            Create Stream
          </h1>
        </div>

        <form action={createStream} className="space-y-6 max-w-xl bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 shadow-sm">
          <input
            type="hidden"
            name="communityId"
            value={communityId}
          />

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#9E9E9E] uppercase tracking-wider block">
              Stream Title
            </label>
            <input
              name="title"
              placeholder="e.g. Building a Compiler in TypeScript"
              className="w-full h-10 px-4 bg-[#070707] border border-[rgba(255,255,255,0.08)] focus:border-[rgba(255,255,255,0.16)] focus:ring-1 focus:ring-[#6366F1] rounded-xl text-white text-sm placeholder-[#5C5C5C] outline-none transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#9E9E9E] uppercase tracking-wider block">
              Stream Description
            </label>
            <textarea
              name="description"
              placeholder="Describe what you will build during this broadcast..."
              rows={4}
              className="w-full p-4 bg-[#070707] border border-[rgba(255,255,255,0.08)] focus:border-[rgba(255,255,255,0.16)] focus:ring-1 focus:ring-[#6366F1] rounded-xl text-white text-sm placeholder-[#5C5C5C] outline-none transition-colors resize-none"
              required
            />
          </div>

          <div className="border-t border-[rgba(255,255,255,0.08)] pt-6 flex justify-end">
            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Create Stream
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}