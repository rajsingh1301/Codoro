import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrockClient } from "@/src/lib/bedrock/client";

// askAI function for general questions + code review + stream context
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
You are a senior software engineer and coding mentor.

You are helping inside this live coding stream.

Stream Title:
${streamTitle}

Stream Description:
${streamDescription}

User Question:
${question}

Code:
${code}

IMPORTANT:

If code is provided, act as a senior engineer performing a professional code review.

Analyze the code for:

1. Bugs and logical errors
2. Performance issues
3. Security vulnerabilities
4. Code quality and maintainability
5. Best practices
6. Edge cases
7. Scalability concerns

For code reviews, always respond in this format:

## Overall Assessment
(Brief summary)

## Issues Found
- Issue 1
- Issue 2

## Improvements
- Improvement 1
- Improvement 2

## Suggested Code
\`\`\`
(corrected code if applicable)
\`\`\`

## Explanation
(Explain why the changes help)

If no code is provided, answer the user's question normally.

Always tailor your answer to the stream context and technology being discussed.

Do not give generic responses if stream context is available.
`
          },
        ],
      },
    ],
  });

  const response = await bedrockClient.send(command);

  return response.output?.message?.content?.[0]?.text ?? "No response";
}

// generateStreamSummary function for generating stream summaries
export async function generateStreamSummary(
  streamTitle: string,
  streamDescription: string
) {
  const command = new ConverseCommand({
    modelId: "amazon.nova-lite-v1:0",

    messages: [
      {
        role: "user",
        content: [
          {
            text: `
Create a concise learning summary for this coding stream.

Stream Title:
${streamTitle}

Stream Description:
${streamDescription}

Provide:

## Topics Covered

## Key Learnings

## Recommended Next Steps

Keep it practical and concise.
            `,
          },
        ],
      },
    ],
  });

  const response = await bedrockClient.send(command);

  return response.output?.message?.content?.[0]?.text ?? "No summary generated";
}
