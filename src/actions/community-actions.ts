"use server";

import { v4 as uuidv4 } from "uuid";
import { createCommunitySchema } from "@/src/validators/community";
import { createCommunityInDB } from "@/src/services/community-services";
import { getCurrentUser } from "@/src/lib/auth/current-user";

export async function createCommunity(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  const result = createCommunitySchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten(),
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: You must be signed in to create a community.");
  }

  await createCommunityInDB({
    communityId: uuidv4(),
    name: result.data.name,
    description: result.data.description,
    ownerId: user.id,
    ownerName: user.username,
    ownerImage: user.imageUrl,
  });

  return {
    success: true,
  };
}
