import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrockClient } from "@/src/lib/bedrock/client";

export async function askAI(
  question: string,
  code: string = "",
  streamTitle: string = "",
  streamDescription: string = ""
) {
  const command = new ConverseCommand({
    modelId: "amazon.nova-lite-v1:0",

    messages: [
      {
        role: "user",
        content: [
          {
            text: `
You are an expert software engineering mentor.

You are helping inside a live coding stream.

Stream Title:
${streamTitle}

Stream Description:
${streamDescription}

User Question:
${question}

Code:

${code}
If code is provided:
- Review the code
- Find bugs
- Suggest improvements
- Explain issues clearly

If no code is provided:
- Answer the question normally
Give a helpful, practical answer focused on the stream context.
        `,
          },
        ],
      },
    ],
  });

  const response = await bedrockClient.send(command);

  return response.output?.message?.content?.[0]?.text ?? "No response";
}
