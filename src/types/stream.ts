export type StreamSummaryDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface StreamSummary {
  title: string;
  summary: string;
  topics: string[];
  highlights: string[];
  difficulty: StreamSummaryDifficulty;
}

export interface Stream {
  streamId: string;
  title: string;
  description: string;
  creatorId: string;
  communityId: string;
  status: "LIVE" | "OFFLINE" | "ENDED";
  playbackUrl: string;
  createdAt: string;
  summary?: StreamSummary;
}
