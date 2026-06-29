"use client";

import { createCommunity } from "@/src/actions/community-actions";

export function CreateCommunityForm() {
  async function handleAction(formData: FormData) {
    await createCommunity(formData);
  }

  return (
    <form action={handleAction} className="space-y-6 max-w-xl bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-md">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-txt-secondary uppercase tracking-wider block font-mono">
          Community Name
        </label>
        <input
          name="name"
          placeholder="e.g. Go Developers"
          className="w-full px-4 py-3 bg-[#171717] border border-[rgba(255,255,255,0.08)] focus:border-accent focus:shadow-[0_0_0_2px_rgba(99,102,241,0.15)] rounded-xl text-white text-xs placeholder:text-txt-muted outline-none transition-all duration-200"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-txt-secondary uppercase tracking-wider block font-mono">
          Community Description
        </label>
        <textarea
          name="description"
          placeholder="Describe topics, libraries, and frameworks discussed in this circle..."
          rows={4}
          className="w-full px-4 py-3 bg-[#171717] border border-[rgba(255,255,255,0.08)] focus:border-accent focus:shadow-[0_0_0_2px_rgba(99,102,241,0.15)] rounded-xl text-white text-xs placeholder:text-txt-muted outline-none transition-all duration-200 resize-none"
          required
        />
      </div>

      <div className="border-t border-[rgba(255,255,255,0.08)] pt-6 flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-dim text-white font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-sm active:translate-y-0 hover:-translate-y-0.5"
        >
          Create Community
        </button>
      </div>
    </form>
  );
}