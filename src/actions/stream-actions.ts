"use server";

import { createStreamInDB } from "@/src/services/streams-services";


// Server action to handle stream creation form submission
export async function createStream(formData: FormData) {
  const title = formData.get("title") as string;

  const description = formData.get("description") as string;

  const communityId = formData.get("communityId") as string;

  await createStreamInDB({
    title,

    description,

    communityId,
  });
}


