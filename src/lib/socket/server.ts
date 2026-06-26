import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3001;

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
  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);
    console.log(`[Socket Server] Client ${socket.id} joined room: ${roomId}`);
  });

  // Handle message relaying
  socket.on("send-message", (data: { roomId: string; username: string; message: string }) => {
    console.log(`[Socket Server] Message from ${data.username} in room ${data.roomId}: ${data.message}`);
    
    const messagePayload = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username: data.username,
      message: data.message,
      timestamp: new Date().toISOString(),
    };

    // Emit the message to everyone in the room (including the sender)
    io.to(data.roomId).emit("message", messagePayload);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket Server] Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[Socket Server] Real-time chat server listening on port ${PORT}`);
});
