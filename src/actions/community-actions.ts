"use server";

import { createCommunitySchema } from "@/src/validators/community";

export async function createCommunity(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  const result = createCommunitySchema.safeParse(rawData);

  if (!result.success) {
    console.log(result.error.flatten());

    return {
      success: false,
      errors: result.error.flatten(),
    };
  }

  console.log("VALID DATA");
  console.log(result.data);

  return {
    success: true,
  };
}
