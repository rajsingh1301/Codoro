# CodeLive Product Development Roadmap

This roadmap outlines the milestones required to take CodeLive from directory layout placeholders to production release.

---

## Phase 1: Authentication & Workspace Setup
* [x] Restructure directories according to production-grade design.
* [x] Draft initial database schemas and software architecture guidelines.
* [ ] Integrate **Clerk Auth Providers** to wrap root layouts and secure edge endpoints.
* [ ] Sync Clerk metadata updates to DynamoDB users table via webhooks.

## Phase 2: Media Pipeline & Streams Provisioning (AWS IVS)
* [ ] Wire Next.js Server Actions to write/read channel indexes from DynamoDB.
* [ ] Integrate AWS SDK IVS client to programmatically create ingest keys when users click "Go Live".
* [ ] Setup custom stream player layout matching custom IVS SDK Web Playback configs.
* [ ] Configure AWS S3 upload paths for streaming thumbnails.

## Phase 3: High-Frequency Realtime Chat (WebSockets)
* [ ] Deploy serverless WebSocket handling configurations in AWS API Gateway.
* [ ] Setup ElastiCache Redis replication to synchronize message logs.
* [ ] Build virtualized list views on the client to optimize browser memory when chat is flooded.
* [ ] Add automatic message persistence queues to write back to DynamoDB chat logs asynchronously.

## Phase 4: AI Stream Companion (Amazon Bedrock)
* [ ] Build Bedrock SDK query route (`/api/ai`) returning readable serverless stream responses.
* [ ] Implement prompt templates specialized in debugging syntax, explaining code structures, and answering stream queries.
* [ ] Configure rate-limiting middleware to limit daily API queries per user.

## Phase 5: Production Hardening, Load Testing & Deployment
* [ ] Run simulated load tests targeting 50,000 concurrent WebSocket connections.
* [ ] Configure CloudFront edge cache headers for `/api/communities` and static routes.
* [ ] Set up end-to-end logging, metric alerts, and horizontal scaling limits.
