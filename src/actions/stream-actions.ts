"use server";

import { createStreamInDB, deleteStream, getStreamById } from "@/src/services/streams-services";
import { getCurrentUser } from "@/src/lib/auth/current-user";
import { redirect } from "next/navigation";

// Server action to handle stream creation form submission
export async function createStream(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const communityId = formData.get("communityId") as string;

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: You must be signed in to create a stream.");
  }

  const streamId = await createStreamInDB({
    title,
    description,
    communityId,
    creatorId: user.id,
    creatorName: user.username,
    creatorImage: user.imageUrl,
  });

  redirect(`/streams/${streamId}`);
}

// Server action to handle stream deletion
export async function deleteStreamAction(streamId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: You must be signed in to delete a stream.");
  }

  const stream = await getStreamById(streamId);
  if (!stream) {
    throw new Error("Stream not found.");
  }

  // Security Check: Sirf stream creator delete kar sake
  if (stream.creatorId !== user.id) {
    throw new Error("Forbidden: You are not the creator of this stream.");
  }

  await deleteStream(streamId);
}


