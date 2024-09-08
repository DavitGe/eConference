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
    // AppDataSource.runMigrations()
    //   .then(() => {
    //     console.log("Migrations run successfully");
    //   })
    //   .catch((e) => {
    //     console.log("Error running migrations", e);
    //   });

    // routes and middleware here
    const app = express();
    const port = process.env.PORT || 3000;
    app.use(cors({
      origin: "http://localhost:5173",
      credentials: true,
    }));
    app.use(express.json()); // This is crucial to parse JSON body
    app.use(session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: "none",
        httpOnly: true,
        secure: true,
      },
    }))
    app.use(function (_, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      // res.setHeader("Access-Control-Allow-Credentials", true);
      next();
    });

    app.use("/api/auth", authRoutes);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error: any) => console.log(error));
