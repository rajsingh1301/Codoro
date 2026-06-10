"use client";

import { createCommunity } from "@/src/actions/community-actions";
import { useState } from "react";

export function CreateCommunityForm() {
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleAction = async (formData: FormData) => {
    setIsPending(true);
    setErrors(null);
    try {
      const result = await createCommunity(formData);
      if (!result.success && result.errors) {
        setErrors(result.errors.fieldErrors);
      } else {
        alert("Community created successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form action={handleAction} className="space-y-4">
      <div>
        <input
          name="name"
          placeholder="Community Name"
          className="w-full border p-2 rounded"
        />
        {errors?.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
        )}
      </div>

      <div>
        <textarea
          name="description"
          placeholder="Community Description"
          className="w-full border p-2 rounded"
        />
        {errors?.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="border px-4 py-2 rounded bg-black text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Creating..." : "Create Community"}
      </button>
    </form>
  );
}
