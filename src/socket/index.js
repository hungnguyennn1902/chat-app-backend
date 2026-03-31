import { Server } from "socket.io";
import http from "http";
import express from "express";

import app from '../app.js'
import { socketAuthMiddleware } from "../middlewares/socketMiddleware.js";
import ConversationService from "../services/conversation.service.js";
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },    
});
io.use(socketAuthMiddleware)
const online_users = new Map()

io.on("connection", async (socket) => {
    const user = socket.user
    console.log(`New socket connection: ${socket.id} for ${user.username}`);
    online_users.set(user._id, socket.id)
    io.emit('online_users', Array.from(online_users.keys()))

    const conversationIds = await ConversationService.getUserConversationsForSocketIO(user._id)
    conversationIds.forEach(conversationId => {
        socket.join(conversationId)
    })
    socket.on("disconnect", () => {
        online_users.delete(user._id)
        io.emit('online_users', Array.from(online_users.keys()))  
        console.log("Socket disconnected: " + socket.id);
    });
});

export { io, httpServer, app };
