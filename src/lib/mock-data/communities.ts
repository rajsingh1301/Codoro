import { Community } from "@/src/types/community";

export const communities: Community[] = [
  {
    communityId: "1",
    name: "React Developers",
    description: "Everything React",
    ownerId: "user1",
    ownerName: "React Guru",
    ownerImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    communityId: "2",
    name: "Go Developers",
    description: "Backend and systems programming",
    ownerId: "user2",
    ownerName: "Go Ninja",
    ownerImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    communityId: "3",
    name: "AWS Builders",
    description: "Cloud and DevOps",
    ownerId: "user3",
    ownerName: "AWS Hero",
    ownerImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
    createdAt: new Date().toISOString(),
  },
];
