"use client";

import { createCommunity } from "@/src/actions/community-actions";

export function CreateCommunityForm() {
  async function handleAction(formData: FormData) {
    await createCommunity(formData);
  }

  return (
    <form action={handleAction} className="space-y-4">
      <input
        name="name"
        placeholder="Community Name"
        className="w-full border p-2 rounded"
      />

      <textarea
        name="description"
        placeholder="Community Description"
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="border px-4 py-2 rounded"
      >
        Create Community
      </button>
    </form>
  );
}