import { ApiError } from "@/utils/ApiError.js";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Auth token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as { userId: string };
    req.user = { id: decoded.userId };
    return next();
  } catch {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token");
  }
}
