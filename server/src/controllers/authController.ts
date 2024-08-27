import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { Request, Response } from "express";
import { User, IUser } from "../models/User";

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
    return res
      .status(201)
      .json({ message: "User registered successfully", token });
  } else {
    return res.status(500).json({ message: "Error while creating user" });
  }
};

const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
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
  return res.json({ token });
};

const setup2FA = (req: Request, res: Response): void => {
  const user = User.findById(req.user!.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const secret: any = speakeasy.generateSecret({ length: 20 });
  user.twoFactorSecret = secret.base32;

  qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
    if (err) {
      res.status(500).json({ message: "Error generating QR code" });
      return;
    }

    res.json({ qrCodeUrl: dataUrl });
  });
};

const verify2FA = (req: Request, res: Response): Response => {
  const { userId, token } = req.body;
  const user = User.findById(userId);
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

export { register, login, setup2FA, verify2FA };
