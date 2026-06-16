"use server";

import { askAI } from "@/src/services/ai-services";

export async function testAI() {
  const response = await askAI("Explain React hooks in simple words");

  console.log(response);
}
