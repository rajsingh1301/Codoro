"use server";

import { createStreamInDB } from "@/src/services/streams-services";
import { getCurrentUser } from "@/src/lib/auth/current-user";

// Server action to handle stream creation form submission
export async function createStream(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const communityId = formData.get("communityId") as string;

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: You must be signed in to create a stream.");
  }

  await createStreamInDB({
    title,
    description,
    communityId,
    creatorId: user.id,
    creatorName: user.username,
    creatorImage: user.imageUrl,
  });
}


