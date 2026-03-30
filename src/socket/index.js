import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },    
});
io.on("connection", (socket) => {
    console.log("Connection established: " + socket.id);
    socket.on("disconnect", () => {
        console.log("Connection disconnected: " + socket.id);
    });
});

export { io, httpServer, app };
