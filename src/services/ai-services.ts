import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

import { bedrockClient } from "@/src/lib/bedrock/client";

export async function askAI(question: string) {
  const command = new ConverseCommand({
    modelId: "amazon.nova-lite-v1:0",

    messages: [
      {
        role: "user",
        content: [
          {
            text: question,
          },
        ],
      },
    ],
  });

  const response = await bedrockClient.send(command);

  return response.output?.message?.content?.[0]?.text ?? "No response";
}
