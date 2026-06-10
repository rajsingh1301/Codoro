import { use } from "react";

interface StreamDetailsPageProps {
  params: Promise<{
    streamId: string;
  }>;
}

export default function StreamDetailsPage({ params }: StreamDetailsPageProps) {
  const resolvedParams = use(params);
  const streamId = resolvedParams.streamId;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">Stream Player Page</h1>
      <p className="text-zinc-500">Creator Stream: {streamId}</p>
    </div>
  );
}
