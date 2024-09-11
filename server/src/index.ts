import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { AppDataSource } from "./data-source";
import cors from "cors";
import session from "express-session";

dotenv.config();

AppDataSource.initialize()
  .then(() => {
    // Uncomment if you need to run migrations
    // AppDataSource.runMigrations()
    //   .then(() => {
    //     console.log("Migrations run successfully");
    //   })
    //   .catch((e) => {
    //     console.log("Error running migrations", e);
    //   });

    const app = express();
    const port = process.env.PORT || 3000;

    // CORS configuration
    app.use(cors({
      origin: "http://localhost:5173",
      credentials: true,
    }));

    app.use(express.json()); // To parse JSON body

    app.use(session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: "none",
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure cookies in production
      },
    }));

    app.use("/api/auth", authRoutes);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error: any) => console.log(error));
