"use server";

import { askAI } from "@/src/services/ai-services";

export async function askAIAssistant(formData: FormData) {
  const question = formData.get("question") as string;
  const code = formData.get("code") as string;
  const streamTitle = formData.get("streamTitle") as string;
  const streamDescription = formData.get("streamDescription") as string;
  return await askAI(question, code, streamTitle, streamDescription);
}
