"use client";

import { createCommunity } from "@/src/actions/community-actions";

export function CreateCommunityForm() {
  async function handleAction(formData: FormData) {
    await createCommunity(formData);
  }

  return (
    <form action={handleAction} className="space-y-6 max-w-xl bg-card-bg border border-border-main rounded-[14px] p-6 shadow-sm">
      <div className="space-y-2">
        <label className="text-xs font-bold text-txt-secondary uppercase tracking-wider block">
          Community Name
        </label>
        <input
          name="name"
          placeholder="e.g. Go Developers"
          className="w-full px-4 py-2.5 bg-surface border border-border-main focus:border-brand/45 rounded-xl text-txt-primary text-xs placeholder:text-txt-muted outline-none transition duration-200"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-txt-secondary uppercase tracking-wider block">
          Community Description
        </label>
        <textarea
          name="description"
          placeholder="Describe topics, libraries, and frameworks discussed in this circle..."
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
          Create Community
        </button>
      </div>
    </form>
  );
}