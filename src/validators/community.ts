import { z } from "zod";

export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
