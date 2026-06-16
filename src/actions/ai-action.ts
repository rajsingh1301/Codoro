"use server";

import { askAI } from "@/src/services/ai-services";

export async function askAIAssistant(formData: FormData) {
  const question = formData.get("question") as string;

  return await askAI(question);
}
