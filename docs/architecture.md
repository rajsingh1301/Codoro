# CodeLive Architecture & System Design

This document details the production-grade architecture of **CodeLive**, a highly scalable live-coding platform designed to support millions of concurrent users.

---

## 1. High-Level Architecture Overview

CodeLive leverages a hybrid Serverless/Edge-native model with Next.js 15, coupled with specialized managed services for media distribution, security, storage, and database indexing.

```mermaid
graph TD
    Client[Web Browser Client] -->|HTTP / Page Requests| NextJS[Next.js 15 App Router]
    Client -->|SSE / WebSockets| WSGateway[Websocket/Chat Service API Gateway]
    Client -->|RTMPS Stream Ingest| IVS[AWS IVS Live Streaming Ingest]
    Client -->|HTTPS Playback| IVSEdge[AWS IVS CloudFront CDN Edge]
    
    NextJS -->|Client Session / JWT| Clerk[Clerk Auth Provider]
    NextJS -->|Low-latency Key-Value Query| DynamoDB[Amazon DynamoDB NoSQL]
    NextJS -->|Prompt Orchestration| Bedrock[Amazon Bedrock Runtime AI]
    NextJS -->|File Uploads / Assets| S3[Amazon S3 Storage]
    
    WSGateway -->|Event Broadcast| Redis[Amazon ElastiCache Redis PubSub]
```

---

## 2. Infrastructure Stack & Scalability Choices

### 2.1 Low-Latency Streaming (AWS Interactive Video Service)
* **Ingest (RTMPS)**: Streamers broadcast using standard streaming software (OBS, Streamlabs) directly to IVS ingest endpoints.
* **Egress (HLS / Low-Latency Egress)**: Video distribution uses AWS IVS CDN edge networks (powered by CloudFront) to achieve sub-2-second latency globally.
* **Scale**: AWS IVS handles dynamic transcoding (1080p, 720p, 480p) out-of-the-box and scales to millions of viewers per channel natively.

### 2.2 Scaling Chat & Realtime updates (WebSockets / Server Sent Events)
* HTTP polling is banned for message feeds at scale. CodeLive will support:
  * **WebSocket Connections** handled by AWS API Gateway or a specialized microservice.
  * **Redis Pub/Sub** (Amazon ElastiCache) to broadcast stream messages across distributed server nodes.
  * Virtualized React rendering to maintain 60 FPS client execution during high-frequency chat bursts (e.g., 20k messages/sec).

### 2.3 Highly Indexed Database Layer (Amazon DynamoDB)
* **Single-Table Design**: We utilize DynamoDB's NoSQL model to achieve sub-10ms query times at any scale.
* **Partition Keys (PK) & Sort Keys (SK)**:
  * **User Profile**: `PK: USER#<userId>`, `SK: METADATA`
  * **Community Guild**: `PK: COMMUNITY#<communityId>`, `SK: DETAILS`
  * **Active Streams**: `PK: STREAMS`, `SK: LIVE#<streamId>` (Global Secondary Index GSI for filtering active vs offline streams).
  * **Chat Message history**: `PK: STREAM#<streamId>#CHAT`, `SK: MSG#<createdAt>#<messageId>` (Optimized for range-key query sorted by time).

### 2.4 LLM Assistant (Amazon Bedrock)
* LLM requests (e.g., code explainers) are executed using **Bedrock Runtime** with model streams (SSE) to prevent blocking main process threads.
* Implements token limits and strict user rate-limiting to prevent vendor API exhaustion.

---

## 3. Security & Auth Flow

* **Clerk Auth**: Handles user sign-in, MFA, session tracking, and JWT signatures.
* **Edge Validation**: Client-sent Clerk JWT token signature validated instantly in Next.js Middleware before triggering serverless function invocations.
