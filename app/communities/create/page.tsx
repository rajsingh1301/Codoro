import { CreateCommunityForm } from "@/src/components/community/create-community-form";
import Link from "next/link";

export default function CreateCommunityPage() {
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
            href="/communities"
            className="text-xs text-accent hover:text-violet-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            ← Back to Communities
          </Link>
          <h1 className="text-3xl font-bold text-primary tracking-tight mt-2">
            Create Community
          </h1>
        </div>

        <CreateCommunityForm />
      </div>
    </div>
  );
}