"use server";

import { revalidatePath } from "next/cache";
import { updateStreamStatus, getStreamById } from "@/src/services/streams-services";
import { getCurrentUser } from "@/src/lib/auth/current-user";

// Server actions to handle stream status updates
export async function goLive(streamId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in.");
  }

  const stream = await getStreamById(streamId);
  if (!stream) {
    throw new Error("Stream not found");
  }

  if (stream.creatorId !== user.id) {
    throw new Error("Unauthorized: Only the stream creator can start the stream.");
  }

  await updateStreamStatus(streamId, "LIVE");
  revalidatePath(`/streams/${streamId}`);
}

// Server action to handle stream status updates
export async function endStream(streamId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in.");
  }

  const stream = await getStreamById(streamId);
  if (!stream) {
    throw new Error("Stream not found");
  }

  if (stream.creatorId !== user.id) {
    throw new Error("Unauthorized: Only the stream creator can end the stream.");
  }

  await updateStreamStatus(streamId, "ENDED");
  revalidatePath(`/streams/${streamId}`);
}
