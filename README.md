# Codoro 🚀

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-DynamoDB%20%7C%20IVS%20%7C%20Bedrock-ff9900?logo=amazon-aws)](https://aws.amazon.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosted-black?logo=vercel)](https://vercel.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6366F1?logo=clerk)](https://clerk.com/)
[![Socket.io](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io)](https://socket.io/)
[![Status](https://img.shields.io/badge/Status-Hackathon--Ready-brightgreen)](#)

> Next-Gen Developer-First Live Coding Platform with Low-Latency Streaming, Real-Time Interactive Chat, and AI-Powered Coding Assistants.

**Live Demo URL**: [https://codoro.vercel.app](https://codoro.vercel.app)

---

## 📖 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [Solution](#-solution)
3. [Key Features](#-key-features)
4. [Tech Stack](#-tech-stack)
5. [Architecture](#-architecture)
6. [Folder Structure](#-folder-structure)
7. [Screenshots](#-screenshots)
8. [Getting Started](#-getting-started)
9. [Environment Variables](#-environment-variables)
10. [AWS Integration](#-aws-integration)
11. [Authentication](#-authentication)
12. [AI Features](#-ai-features)
13. [Scalability](#-scalability)
14. [Performance Optimizations](#-performance-optimizations)
15. [Security](#-security)
16. [Deployment](#-deployment)
17. [Future Roadmap](#-future-roadmap)
18. [Contributing](#-contributing)
19. [License](#-license)
20. [Acknowledgements](#-acknowledgements)
21. [Contact](#-contact)

---

## 🚨 Problem Statement

Traditional live-streaming platforms (like Twitch or YouTube) are built for mass-market entertainment, not code. Developers face severe constraints:
- **High latency (5-15s)** makes real-time debugging interaction with viewers sluggish.
- **Generic chat rooms** lack syntax highlights, code snippets, or technical context.
- **Passive learning environments** where viewers can only watch screen shares without structured summaries or inline assistance.
- **Siloed ecosystems** that separate the stream video, chat, code review, and learning reference documents.

---

## 💡 Solution

**Codoro** transforms passive coding tutorials into an interactive, collaborative ecosystem by pairing low-latency streaming with specialized technical workspaces:
- **Sub-second latency (Ultra-low latency)** using **Amazon IVS** brings broadcaster-viewer interaction to real-time.
- **Developer-Native Chat & Presence** powered by **Socket.io** enables viewers to share code snippets and chat dynamically.
- **AI Coding Assistant** acts as a senior engineer directly in the stream context to perform reviews or explain concepts.
- **AI Session Summaries** synthesize stream transcripts and description into topics, highlights, and difficulty tags on stream completion.

---

## ✨ Key Features

### 🎥 Broadcast Engine
- **Direct Browser Streaming**: Stream from your webcam, mic, or screen share directly via standard WebRTC, without downloading external tools.
- **OBS Studio Integration**: Stream using standard desktop encoder tools (OBS, Streamlabs) via stable RTMP server ingestion.

### 🤖 AI Streaming Tools
- **AI Coding Assistant**: Inline Q&A assistant trained to review code, spot bugs, and explain logic using **Amazon Bedrock (Nova Lite)**.
- **AI Stream Summarizer**: Automatically parses stream description and metadata into high-fidelity learning summaries on stream completion.

### 💬 Real-Time Chat & Presence
- **Dynamic Live Chat**: Ultra-fast message relays with developer colors and database message persistence.
- **Viewer Count Presence**: Live presence counters calculating concurrent views using active socket sessions.

### 🌐 Developer Communities
- **Community Portal**: Creators can launch communities tailored to specific tech (React, Go, Python, AWS), bundling streams under focused spaces.

---

## 🛠 Tech Stack

| Layer | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Next.js 16 (App Router), TypeScript, Tailwind CSS | Sleek, glassmorphic UI with responsive desktop/mobile layouts. |
| **Database** | Amazon DynamoDB | Low-latency NoSQL table storage for streams, messages, and communities. |
| **Video Delivery** | Amazon Interactive Video Service (IVS) | RTMPS stream ingestion, transcoding, and low-latency HLS player delivery. |
| **AI Services** | Amazon Bedrock (Nova Lite) | Powering context-aware assistant responses and structured JSON summaries. |
| **Realtime Chat** | Socket.io (Node.js) | Standalone microservice for presence and instant message broadcasts. |
| **Authentication** | Clerk | Multi-tenant authentication with secure routing. |
| **Deployment** | Vercel (Frontend), Railway (Socket Server) | Distributed cloud deployment pipeline. |

---

## 📐 Architecture

Codoro uses a decoupled, event-driven architecture combining Next.js Server Actions with dedicated AWS media resources and realtime socket servers:

```
[User Browser]
      │
      ├── (RTMP Video Ingest) ────────► [Amazon IVS] ──── (HLS Video Playback) ──► [Viewer Player]
      │
      ├── (HTTPS Pages / Actions) ────► [Next.js App (Vercel)]
      │                                       │
      │                                       ├── (Session Verification) ───────► [Clerk Auth]
      │                                       │
      │                                       ├── (Queries & Mutations) ────────► [Amazon DynamoDB]
      │                                       │
      │                                       └── (AI Generation Prompts) ──────► [Amazon Bedrock]
      │
      └── (Realtime Websockets) ──────► [Socket.io (Railway)] ── (Persist Message) ──► [Amazon DynamoDB]
```

*For a detailed block visualization, please check the [architecture_diagram.md](file:///Users/mayankraj/.gemini/antigravity-ide/brain/f695205a-423f-4b29-adbb-03befa6ee199/architecture_diagram.md).*

---

## 📂 Folder Structure

```
codoro/
├── app/                        # Next.js App Router Routes & Pages
│   ├── api/                    # Serverless API routes (AI, streams, chat, summary)
│   ├── communities/            # Community portals
│   ├── dashboard/              # Creator Studio & stats panel
│   └── streams/                # Main playback page
├── src/
│   ├── actions/                # Next.js Server Actions
│   ├── components/             # React UI components
│   │   ├── ai/                 # Stream summaries & Q&A components
│   │   ├── community/          # Communities grids and cards
│   │   ├── dashboard/          # Creator dashboard widgets
│   │   ├── stream/             # Live chat, IVS player wrapper, presence trackers
│   │   └── ui/                 # Reusable layout primitives
│   ├── lib/                    # Configuration modules (AWS SDK, DynamoDB, IVS, Clerk)
│   ├── services/               # Business logic core layers
│   │   ├── ai-services.ts      # Bedrock client Converse API wrappers
│   │   └── streams-services.ts # Stream database mutation layer
│   └── types/                  # TypeScript interface types definitions
├── proxy.ts                    # Clerk Middleware router rules
├── package.json
└── tsconfig.json
```

---

## 📸 Screenshots

> [!TIP]
> *Replace placeholders with actual project screenshots once deployed to production.*

### 🖥️ Creator Studio Dashboard
*Placeholder: Beautiful workspace with direct browser streaming canvas, chat box, stream key inputs, and metrics grid.*

### 📺 Public Viewer stream details page
*Placeholder: High-fidelity player playing developer stream, inline active chat, communities tag, and description block.*

### 🤖 Session Summary Card
*Placeholder: Elegant AI summary container containing key moments highlights checklist, key topics badges, and difficulty badge.*

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or later)
- NPM, Yarn, or PNPM
- An AWS account (Access Key, Secret Key, permissions for DynamoDB, IVS, and Bedrock Nova Lite)
- A Clerk Account (Publishable Key and Secret Key)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rajsingh1301/Codoro.git
   cd Codoro
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Set up Local Configuration**:
   Create a `.env.local` file in the root directory:
   ```bash
   touch .env.local
   ```
   Add your keys matching the [Environment Variables](#-environment-variables) list.

4. **Run the Development Server**:
   Start Next.js local server:
   ```bash
   npm run dev
   ```
   *Next.js will boot on [http://localhost:3000](http://localhost:3000)*

5. **Start Realtime Socket Server**:
   ```bash
   npx ts-node src/lib/socket/server.ts
   ```
   *Socket server will boot on port 3001.*

---

## 🔑 Environment Variables

| Variable Key | Description | Environment |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | IAM User access key with IVS, DynamoDB, Bedrock access | Server |
| `AWS_SECRET_ACCESS_KEY` | IAM User secret key corresponding to access key | Server |
| `AWS_REGION` | AWS Region (default: `us-east-1`) | Server |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk developer account publishable key | Client/Server |
| `CLERK_SECRET_KEY` | Clerk developer account secret backend key | Server |
| `NEXT_PUBLIC_SOCKET_SERVER_URL` | Socket.io server connection host url | Client |

---

## ☁️ AWS Integration

### Why DynamoDB?
- **Sub-millisecond Latency**: DynamoDB delivers consistent, single-digit millisecond response times required to power realtime stream status updates and instant page loads.
- **Flexible Schema**: Stores unstructured stream metrics and structured nested AI summaries safely as Maps.
- **Serverless Scaling**: Scales seamlessly from zero to millions of requests without manual database clustering.

### Data Model Map
- **streams Table**: `streamId` (Partition Key), `status`, `title`, `description`, `playbackUrl`, `creatorId`, `summary` (Map containing AI outputs).
- **messages Table**: `messageId` (Partition Key), `streamId` (Sort Key), `userId`, `username`, `message`, `createdAt`.
- **communities Table**: `communityId` (Partition Key), `name`, `description`, `ownerId`.

---

## 🔐 Authentication

Authentication is handled securely via **Clerk**:
- **Clerk Middleware** (`proxy.ts` / `middleware.ts`) intercepts protected routes like `/dashboard` and `/communities/create` on Vercel edge routes.
- **Context Preservation**: Seamlessly extracts session payload and user profiles using Server Actions safely.
- **Session Security**: Automatically signs out users and restricts chat message emission to authenticated websocket connections.

---

## 🧠 AI Features

### 1. AI Coding Assistant
- Powered by **Amazon Bedrock (Nova Lite)**.
- Broadcasters and viewers can attach code blocks to questions directly.
- The assistant performs professional code reviews detailing assessment, bugs, performance improvements, and proposed corrected code blocks with syntax highlighting.

### 2. AI Session Summaries
- Triggers when a stream transitions to `ENDED`.
- Calls Bedrock using a system prompt configured for structured JSON synthesis:
  ```json
  {
    "title": "one line session title",
    "summary": "2-3 sentence summary of what was built/discussed",
    "topics": ["topic1", "topic2", "topic3"],
    "highlights": ["key moment 1", "key moment 2", "key moment 3"],
    "difficulty": "Beginner | Intermediate | Advanced"
  }
  ```
- Parses safely and stores directly into DynamoDB.

---

## 📈 Scalability

- **Serverless compute**: Next.js runs on Vercel's global edge network, meaning pages load close to the user with zero server management.
- **Global Video Distribution**: Amazon IVS utilizes Amazon CloudFront edge locations, distributing media feeds worldwide with low-latency playback capability for thousands of concurrent viewers.
- **Decoupled Websockets**: Standalone socket.io containers handle heavy WebSocket connections, removing polling overhead from Vercel serverless functions.

---

## ⚡ Performance Optimizations

- **Streaming Status Polling Optimization**: Creators' dashboards poll stream endpoints dynamically to monitor stream ingest rates without congesting background server resources.
- **Lazy Loading Components**: Code-split bulky WebRTC libraries (like `amazon-ivs-web-broadcast`) to improve initial bundle loading speed.
- **NoSQL Sort Queries**: Indexing realtime chat using sort keys (`createdAt` / `streamId`) for fast database queries.

---

## 🛡️ Security

- **Edge Authentication**: Clerk session token validation happens on the edge before database hits.
- **Secrets Encryption**: No AWS keys, regions, or endpoint URLs are hardcoded; all configuration is parsed via secure environment variables.
- **Inputs Sanitization**: Messages are sanitized on input fields to prevent Cross-Site Scripting (XSS) attacks.

---

## 🚀 Deployment

### Deploying on Vercel (Frontend)
1. Link your repository in Vercel.
2. Next.js will be detected automatically.
3. Configure environment variables in project settings.
4. Click **Deploy**.

### Deploying Socket Server (Railway)
1. Create a Railway project.
2. Select the repository path and configure node startup variables.
3. Bind port to `3001` or let Railway assign one.

---

## 🗺️ Future Roadmap

1. [ ] **Multi-Screen Ingest**: Allow secondary screen sharing feeds inside the web broadcaster.
2. [ ] **AI-Powered Stream Highlights Clippings**: Automatically cut short video highlights when active chat activity increases.
3. [ ] **Subscriber Paywalls**: Gated streams accessible only to paid community subscribers.
4. [ ] **Realtime Collaborative Editor (VS Code integration)**: Viewer can view code editor files live on the sidebar.
5. [ ] **Speech-to-Text Transcriptions**: Use AWS Transcribe to feed actual voice audio to Bedrock for summaries.
6. [ ] **Auto-Generated Coding Quizzes**: AI creates quizzes from stream context for viewers.
7. [ ] **Custom JWT migrations**: Fully migrate from Clerk to customized database authentication.
8. [ ] **Interactive Overlay Badges**: Show viewer leaderboards overlays on top of the live video stream player.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 💖 Acknowledgements

- [Amazon Web Services (AWS)](https://aws.amazon.com/)
- [Vercel & Next.js Team](https://nextjs.org/)
- [Clerk Authentication Developer Community](https://clerk.com/)

---

## ✉️ Contact

- **GitHub**: [rajsingh1301](https://github.com/rajsingh1301)
- **Email**: [rjss2829singh@gmail.com](mailto:rjss2829singh@gmail.com)
