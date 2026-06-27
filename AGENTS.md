<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# CodeLive AI Development Guide

## Project Overview
CodeLive is a developer-first live coding platform.

The platform supports:
* Live coding streams
* Browser Streaming
* OBS Streaming
* AWS IVS
* AI Assistant
* AI Stream Summary
* Live Chat
* Live Viewer Presence
* Communities
* Clerk Authentication
* DynamoDB

The objective is to maintain a clean, scalable architecture while rapidly developing features for a hackathon.

---

## General Rules
These rules are mandatory.
1. Modify the minimum number of files required.
2. Never refactor unrelated code.
3. Never rename files unless explicitly instructed.
4. Never move files.
5. Never rewrite working implementations.
6. Never introduce breaking changes.
7. Preserve the existing architecture.
8. Prefer extending existing services over creating duplicate logic.
9. Always reuse existing APIs if possible.
10. Preserve the current coding style.

---

## Architecture
Application structure follows:

Components → Actions → Services → AWS / Database

* **Business logic** belongs inside Services.
* **Actions** should only orchestrate Services.
* **Components** should never directly communicate with DynamoDB or AWS.

---

## Authentication
Authentication is handled by Clerk.
* Never import Clerk directly throughout the project.
* Always use: `src/lib/auth/current-user.ts`.
* Future migrations will replace Clerk with custom JWT authentication. The rest of the project should remain unchanged.

---

## AWS
AWS services currently used:
* DynamoDB
* Amazon IVS
* AWS Bedrock

Future:
* Amazon S3
* Amazon EventBridge

Rules:
* Never hardcode: ARNs, AWS Keys, Regions, or Endpoints.
* Always use environment variables.

---

## Streaming
Streaming supports BOTH:
1. Browser Streaming
2. OBS Streaming

These two implementations must always coexist.
* Never remove one while modifying the other.
* Viewer playback must remain compatible with both.

---

## Socket.IO
Socket.IO is responsible for:
* Live Chat
* Live Viewer Presence

Future realtime features should reuse the existing socket infrastructure.
* Do not introduce another realtime technology.

---

## AI
Current AI Features:
* Assistant
* Stream Summary

Future AI features should reuse the existing AI services.
* Never duplicate AI integrations.

---

## Database
Current database: Amazon DynamoDB
* Existing tables should be reused whenever possible.
* Avoid creating duplicate entities.

---

## UI Rules
* Use TailwindCSS.
* Keep UI consistent.
* Every new page should include: Loading states, Empty states, Error states, and Mobile responsiveness.
* Do not redesign unrelated pages.

---

## Performance
* Prefer lazy loading.
* Avoid unnecessary polling.
* Reuse existing API requests.
* Avoid duplicate network requests.
* Prevent unnecessary React re-renders.

---

## Error Handling
* Never silently ignore errors.
* Provide user-friendly messages.
* Gracefully recover whenever possible.
* Avoid application crashes.

---

## Feature Development Rules
When implementing a feature:
1. Understand the existing implementation.
2. Reuse existing services.
3. Avoid duplicate APIs.
4. Modify minimum files.
5. Keep changes isolated.
6. Return a summary of modified files.

---

## Strict Patch Mode
Unless explicitly instructed otherwise:
* Do not optimize unrelated code.
* Do not refactor unrelated code.
* Do not clean unrelated files.
* Do not reorganize folders.
* Do not update dependencies.
* Do not introduce new architecture.

Every task should behave like a focused Git patch.

---

## Existing Features (Protected)
The following features are considered stable and should never be modified unless explicitly requested:
* Clerk Authentication
* Browser Streaming
* OBS Streaming
* AWS IVS Integration
* Live Chat
* Live Viewer Presence
* AI Assistant
* AI Stream Summary
* Communities
* DynamoDB Models
* Stream Player
* Socket.IO Server

---

## Before Making Changes
Always ask:
* Can I reuse an existing service?
* Can I modify fewer files?
* Can I avoid creating a duplicate implementation?

If the answer is yes, prefer that solution.

---

## Deliverables
For every completed task, provide:
* Files modified
* Files created
* Summary of changes
* Manual testing steps
* Confirmation that unrelated features were not modified

The goal is to keep CodeLive maintainable, production-quality, and easy to migrate after the hackathon. Follow `.agents/skills` strictly.
