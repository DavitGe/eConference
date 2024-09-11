import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { AppDataSource } from "./data-source";
import cors from "cors";
import session from "express-session";
import { createServer } from "http"; // Import HTTP to wrap the Express server
import { Server } from "socket.io"; // Import Socket.IO
import { videoCall } from "./sockets/videoCall";

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

    // Socket.IO signallers
    io.on("videoCall", videoCall);

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
