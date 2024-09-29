import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { AppDataSource } from "./data-source";
import cors from "cors";
import session from "express-session";
import { createServer } from "http"; // Import HTTP to wrap the Express server
import { Server } from "socket.io"; // Import Socket.IO

dotenv.config();

AppDataSource.initialize()
  .then(() => {
    const app = express();
    const port = process.env.PORT || 3000;

    // Create an HTTP server using Express
    const httpServer = createServer(app);

    // Initialize Socket.IO with the HTTP server
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log(`Socket Connected`, socket.id);
      socket.on("room:join", (data) => {
        const { room } = data;
        io.to(room).emit("user:joined", { id: socket.id });
        socket.join(room);
        io.to(socket.id).emit("room:join", data);
      });

      socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
      });

      socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
      });

      socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
      });

      socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
      });
    });

    // CORS configuration
    app.use(
      cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
      })
    );

    app.use(express.json()); // To parse JSON body

    app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET!,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
          sameSite: "none",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Only secure cookies in production
        },
      })
    );

    // Use your existing auth routes
    app.use("/api/auth", authRoutes);

    // Start the server with Socket.IO
    httpServer.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error: any) => console.log(error));
