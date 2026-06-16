"use server";

import { revalidatePath } from "next/cache";
import { updateStreamStatus } from "@/src/services/streams-services";

// Server actions to handle stream status updates
export async function goLive(streamId: string) {
  await updateStreamStatus(
    streamId,

    "LIVE",
  );

  revalidatePath(`/streams/${streamId}`);
}

// Server action to handle stream status updates
export async function endStream(streamId: string) {
  await updateStreamStatus(
    streamId,

    "ENDED",
  );

  revalidatePath(`/streams/${streamId}`);
}
