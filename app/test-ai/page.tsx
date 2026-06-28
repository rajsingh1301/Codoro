import { askAI } from "@/src/services/ai-services";

export default async function TestAIPage() {
  const response = await askAI(
    "Explain React Hooks in simple words"
  );

  return (
    <div className="min-h-screen w-full relative">
      {/* Dark Dot Matrix */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#0a0a0a',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
            radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
          imageRendering: 'pixelated',
        }}
      />
      {/* existing page content — relative z-10 lagao taaki content dot matrix ke upar rahe */}
      <div className="relative z-10 p-8 text-primary font-mono text-xs">
        <pre className="whitespace-pre-wrap select-text">{response}</pre>
      </div>
    </div>
  );
}