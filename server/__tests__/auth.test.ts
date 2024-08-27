import request from "supertest";
import express, { Application } from "express";
import authRoutes from "../src/routes/auth";
import { User } from "../src/models/User";
import jwt from "jsonwebtoken";
import { describe, expect, it, beforeEach } from "@jest/globals";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
// Create an Express application for testing
const app: Application = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth API", () => {
  beforeEach(() => {
    User.users = []; // Reset the "database" before each test
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered successfully");
      expect(User.users.length).toBe(1);
    });

    it("should not register a user with an existing email", async () => {
      User.create({
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        passwordHash: "somehash",
        role: "Participant",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "Jane Doe",
        email: "johndoe@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      const passwordHash = await bcrypt.hash("password123", 10);
      User.create({
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        passwordHash,
        role: "Participant",
      });
    });

    it("should login an existing user with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "johndoe@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it("should not login a user with incorrect credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "johndoe@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should prompt for 2FA if enabled", async () => {
      // User.users[0].twoFactorSecret = "some2FASecret";

      const res = await request(app).post("/api/auth/login").send({
        email: "johndoe@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.isTwoFactorEnabled).toBe(true);
    });
  });

  describe("POST /api/auth/2fa/setup", () => {
    let token: string;

    beforeEach(() => {
      const user = User.create({
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        passwordHash: "somehash",
        role: "Participant",
      });

      token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
    });

    it("should setup 2FA for a logged-in user", async () => {
      const res = await request(app)
        .post("/api/auth/2fa/setup")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body.qrCodeUrl).toBeDefined();
    });
  });

  describe("POST /api/auth/2fa/verify", () => {
    let user: User;

    beforeEach(() => {
      user = User.create({
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        passwordHash: "somehash",
        role: "Participant",
        twoFactorSecret: "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD",
      });
    });

    it("should verify 2FA and return a JWT token", async () => {
      const fakeTOTP = speakeasy.totp({
        secret: user.twoFactorSecret!,
        encoding: "base32",
      });

      const res = await request(app).post("/api/auth/2fa/verify").send({
        userId: user.id,
        token: fakeTOTP,
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it("should return an error for invalid 2FA token", async () => {
      const res = await request(app).post("/api/auth/2fa/verify").send({
        userId: user.id,
        token: "wrongtoken",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid 2FA token");
    });
  });
});
