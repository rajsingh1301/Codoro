import { askAI } from "@/src/services/ai-services";

export default async function TestAIPage() {
  const response = await askAI(
    "Explain React Hooks in simple words"
  );

  return (
    <div className="p-8">
      <pre>{response}</pre>
    </div>
  );
}