import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { Request, Response } from "express";
import { User, IUser } from "../models/User";
import { AppDataSource } from "../data-source";

const register = async (req: Request, res: Response): Promise<Response> => {
  if (!req?.body?.username || !req?.body?.email || !req?.body?.password)
    return res
      .status(400)
      .json({ message: "Please provide all fields", req: req.body });
  const { username, email, password } = req?.body;

  let user = await User.findByEmail(email);
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  user = new User(0, username, email, passwordHash, "Participant");
  const newUser = await User.create(user);
  if (newUser?.id) {
    const token = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("authorization", token, {
      httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
      secure: true, // Ensure the cookie is only sent over HTTPS
      maxAge: Number(process.env.JWT_EXPIRES_IN), // Set expiration time in milliseconds (e.g., 1 hour)
      sameSite: "strict", // Helps prevent CSRF attacks
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevent access by JavaScript
      secure: true, // Use only HTTPS
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN), // Longer expiration (e.g., 7 days)
      sameSite: "strict",
    });
    return res.status(200).json({
      message: "User registered successfully",
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    return res.status(500).json({ message: "Error while creating user" });
  }
};

const login = async (req: Request, res: Response): Promise<Response> => {
  if (!req?.body?.email || !req?.body?.password)
    return res
      .status(400)
      .json({ message: "Please provide all fields", req: req.body });
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user?.id) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (user.twoFactorSecret) {
    return res.status(200).json({ userId: user.id, isTwoFactorEnabled: true });
  }

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("authorization", token, {
    httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
    maxAge: Number(process.env.JWT_EXPIRES_IN), // Set expiration time in milliseconds (e.g., 1 hour)
    secure: true
  });
  res.cookie("refreshToken",refreshToken, {
    httpOnly: true, // Prevent access by JavaScript
    maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN), // Longer expiration (e.g., 7 days)
    secure: true
  });
  return res.json({
    username: user.username,
    email: user.email,
    role: user.role,
  });
};

const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  //token is refreshed automaticly in middleware
  const user = req.user;
  if (!user) 
    return res.status(401).json({ message: "Unauthorized" });
  return res.status(200).json({ username: user.username,
    email: user.email,
    role: user.role });
};

const setup2FA = async (req: Request, res: Response): Promise<void> => {
  const secret: any = speakeasy.generateSecret({ length: 20 });
  const query = `UPDATE user SET twoFactorSecret = "${
    secret.base32
  }" WHERE id = ${req.user!.id};`;
  try {
    qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
      if (err) {
        res.status(500).json({ message: "Error generating QR code" });
        throw "Error generating QR code";
      }

      AppDataSource.query(query).then(() => {
        res
          .status(200)
          .json({ message: "2FA has been setup", qrCodeUrl: dataUrl });
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Error while setting up 2FA: ", err });
    return;
  }
};

const verify2FA = async (req: Request, res: Response): Promise<Response> => {
  const { userId, token } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret!,
    encoding: "base32",
    token,
  });

  if (!verified) {
    return res.status(400).json({ message: "Invalid 2FA token" });
  }

  const jwtToken = generateToken(user);
  return res.json({ token: jwtToken });
};

const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
};

export {
  register,
  login,
  setup2FA,
  verify2FA,
  generateRefreshToken,
  generateToken,
  refreshToken
};
