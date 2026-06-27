import { CreateCommunityForm } from "@/src/components/community/create-community-form";
import Link from "next/link";

export default function CreateCommunityPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-6 text-txt-primary">
      <div className="space-y-1">
        <Link
          href="/communities"
          className="text-xs text-brand hover:text-brand-hover font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          ← Back to Communities
        </Link>
        <h1 className="text-3xl font-extrabold text-txt-primary tracking-tight mt-2">
          Create Community
        </h1>
      </div>

      <CreateCommunityForm />
    </div>
  );
}