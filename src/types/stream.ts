export interface Stream {
  streamId: string;
  title: string;
  description: string;
  creatorId: string;
  communityId: string;
  status: "LIVE" | "OFFLINE";
  playbackUrl: string;
  createdAt: string;
}
