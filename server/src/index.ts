import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { AppDataSource } from "./data-source";

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

    app.use(express.json()); // This is crucial to parse JSON body

    app.use("/api/auth", authRoutes);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error: any) => console.log(error));
