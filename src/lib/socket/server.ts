import dotenv from "dotenv";
import path from "path";
// Load .env.local to populate process.env before any client instantiation
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createServer } from "http";
import { Server } from "socket.io";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const PORT = process.env.PORT || 3001;

// In-memory data structures for real viewer presence tracking
const streamViewers = new Map<string, Set<string>>();
const socketToStreamMap = new Map<string, string>();

// Instantiate the database clients AFTER dotenv.config()
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.io server is running\n");
});

const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, restrict this to your front-end domain
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`[Socket Server] Client connected: ${socket.id}`);

  // Handle joining a stream room
  socket.on("join-room", (streamId: string) => {
    socket.join(streamId);
    console.log(`[Socket Server] Client ${socket.id} joined room: ${streamId}`);
  });

  // Handle joining a stream (real viewer presence)
  socket.on("join-stream", (data: { streamId: string; userId: string }) => {
    socket.join(data.streamId);
    socketToStreamMap.set(socket.id, data.streamId);

    if (!streamViewers.has(data.streamId)) {
      streamViewers.set(data.streamId, new Set());
    }
    streamViewers.get(data.streamId)!.add(socket.id);

    const count = streamViewers.get(data.streamId)!.size;
    console.log(`[Presence Server] Client ${socket.id} joined stream ${data.streamId}. Current viewers: ${count}`);

    // Broadcast updated viewer count to everyone in that stream
    io.to(data.streamId).emit("viewer-count", {
      streamId: data.streamId,
      viewerCount: count,
    });
  });

  // Handle leaving a stream
  socket.on("leave-stream", (data: { streamId: string }) => {
    socket.leave(data.streamId);
    socketToStreamMap.delete(socket.id);

    const viewers = streamViewers.get(data.streamId);
    if (viewers) {
      viewers.delete(socket.id);
      const count = viewers.size;
      console.log(`[Presence Server] Client ${socket.id} left stream ${data.streamId}. Current viewers: ${count}`);

      io.to(data.streamId).emit("viewer-count", {
        streamId: data.streamId,
        viewerCount: count,
      });
    }
  });

  // Handle message relaying
  socket.on("send-message", async (data: { 
    streamId: string; 
    userId: string; 
    username: string; 
    avatar: string; 
    message: string; 
  }) => {
    console.log(`[Socket Server] Message from ${data.username} in room ${data.streamId}: ${data.message}`);
    
    const messagePayload = {
      messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      username: data.username,
      avatar: data.avatar,
      streamId: data.streamId,
      message: data.message,
      createdAt: new Date().toISOString(),
    };

    try {
      // Save message in DynamoDB before broadcasting
      await docClient.send(
        new PutCommand({
          TableName: "messages",
          Item: messagePayload,
        })
      );
      console.log(`[Socket Server] Persisted message to DynamoDB: ${messagePayload.messageId}`);

      // Emit the message to everyone in the room (including the sender)
      io.to(data.streamId).emit("message", messagePayload);
    } catch (err) {
      console.error("[Socket Server] Failed to save and broadcast message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`[Socket Server] Client disconnected: ${socket.id}`);

    const streamId = socketToStreamMap.get(socket.id);
    if (streamId) {
      const viewers = streamViewers.get(streamId);
      if (viewers) {
        viewers.delete(socket.id);
        const count = viewers.size;
        console.log(`[Presence Server] Client ${socket.id} disconnected from stream ${streamId}. Current viewers: ${count}`);

        io.to(streamId).emit("viewer-count", {
          streamId,
          viewerCount: count,
        });
      }
      socketToStreamMap.delete(socket.id);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`[Socket Server] Real-time chat server listening on port ${PORT}`);
});
