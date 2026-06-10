import { Community } from "@/src/types/community";

export const communities: Community[] = [
  {
    communityId: "1",
    name: "React Developers",
    description: "Everything React",
    createdBy: "user1",
    createdAt: new Date().toISOString(),
  },
  {
    communityId: "2",
    name: "Go Developers",
    description: "Backend and systems programming",
    createdBy: "user2",
    createdAt: new Date().toISOString(),
  },
  {
    communityId: "3",
    name: "AWS Builders",
    description: "Cloud and DevOps",
    createdBy: "user3",
    createdAt: new Date().toISOString(),
  },
];
