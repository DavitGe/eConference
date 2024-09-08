import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import {
  generateRefreshToken,
  generateToken,
} from "../controllers/authController";

interface JwtPayload {
  id: number;
}

const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if(!req.headers.cookie?.length) return res.status(401).json({ message: "No token provided" });
  const cookies = req.headers.cookie.split(' ');
  const token = cookies.find((cookie) => cookie.includes('authorization'))?.split('=')[1]?.slice(0,-1) ?? '';
  const refreshToken = cookies.find((cookie) => cookie.includes('refreshToken'))?.split('=')[1]?.slice(0,-1) ?? '';
  if(!token?.length || !refreshToken?.length) return res.status(401).json({ message: "No token provided" });

  if (!token?.length || !refreshToken?.length) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    try {
      const decoded = jwt.verify(
        refreshToken?.split(" ")?.[1] ?? "",
        process.env.JWT_REFRESH_SECRET as string
      ) as JwtPayload;
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const newAccessToken = generateToken(user);
      const newRefreshToken = generateRefreshToken(user);
      res.cookie("authorization", newAccessToken, {
        httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
        secure: true, // Ensure the cookie is only sent over HTTPS
        maxAge: Number(process.env.JWT_EXPIRES_IN), // Set expiration time in milliseconds (e.g., 1 hour)
        sameSite: "strict", // Helps prevent CSRF attacks
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true, // Prevent access by JavaScript
        secure: true, // Use only HTTPS
        maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN), // Longer expiration (e.g., 7 days)
        sameSite: "strict",
      });
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token", error });
    }
  }
};

const authorizeRole =
  (role: string) =>
  (req: Request, res: Response, next: NextFunction): Response | void => {
    if (req.user!.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };

export { protect, authorizeRole };
