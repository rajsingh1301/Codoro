"use server";

import { v4 as uuidv4 } from "uuid";
import { createCommunitySchema } from "@/src/validators/community";
import { createCommunityInDB } from "@/src/services/community-services";

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

  await createCommunityInDB({
    communityId: uuidv4(),
    name: result.data.name,
    description: result.data.description,
    createdBy: "temp-user",
  });

  return {
    success: true,
  };
}
