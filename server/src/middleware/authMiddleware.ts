import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

interface JwtPayload {
  id: number;
}

const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
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
    return res.status(401).json({ message: "Invalid token", error });
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
