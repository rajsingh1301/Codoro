export interface Stream {
  streamId: string;
  title: string;
  description: string;
  creatorId: string;
  communityId: string;
  status: "OFFLINE" | "LIVE" | "ENDED";
  playbackUrl: string;
  streamKey?: string;
  channelArn?: string;
  createdAt: string;
}
