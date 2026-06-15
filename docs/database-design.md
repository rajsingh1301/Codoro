# CodeLive Database Design

## Overview

CodeLive is a live coding platform where developers can:

- Create communities
- Start live coding streams
- Join streams
- Chat in real time
- Ask AI coding questions

---

# User

Represents a platform user.

Fields:

- userId
- username
- imageUrl
- bio
- createdAt

Example:

{
  "userId": "user_123",
  "username": "raj",
  "imageUrl": "https://...",
  "bio": "Full Stack Developer",
  "createdAt": "2026-06-10"
}

---

# Community

Represents a developer community.

Fields:

- communityId
- name
- description
- createdBy
- createdAt

Example:

{
  "communityId": "community_1",
  "name": "React Developers",
  "description": "Community for React developers",
  "createdBy": "user_123",
  "createdAt": "2026-06-10"
}

---

# Stream

Represents a live coding stream.

Fields:

- streamId
- title
- description
- creatorId
- communityId
- status
- playbackUrl
- createdAt

Example:

{
  "streamId": "stream_1",
  "title": "Building SaaS with Next.js",
  "description": "Live coding session",
  "creatorId": "user_123",
  "communityId": "community_1",
  "status": "LIVE",
  "playbackUrl": "https://...",
  "createdAt": "2026-06-10"
}

---

# Message

Represents a chat message.

Fields:

- messageId
- streamId
- userId
- content
- createdAt

Example:

{
  "messageId": "msg_1",
  "streamId": "stream_1",
  "userId": "user_456",
  "content": "Can you explain useEffect?",
  "createdAt": "2026-06-10"
}

---

# Stream Participant

Represents a user currently viewing a stream.

Fields:

- streamId
- userId
- joinedAt

Example:

{
  "streamId": "stream_1",
  "userId": "user_456",
  "joinedAt": "2026-06-10"
}

---

# Relationships

User
 ├── Creates Communities
 ├── Creates Streams
 └── Sends Messages

Community
 └── Contains Streams

Stream
 ├── Contains Messages
 └── Has Participants