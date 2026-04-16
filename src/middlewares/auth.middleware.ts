import { NextFunction, Request, Response } from "express";
import { apiErrors } from "../utills/error.handler";
import { verifyAccessToken } from "../utills/token";

type AuthenticatedRequest = Request & {
  authUser?: {
    email: string;
  };
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw apiErrors.unauthorized("Authorization token is required");
    }

    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      throw apiErrors.unauthorized("Authorization token is required");
    }

    const payload = verifyAccessToken(token);
    (req as AuthenticatedRequest).authUser = { email: payload.email };
    next();
  } catch (error) {
    const { statusCode, body } = apiErrors.handleApiErrors(apiErrors.unauthorized("Invalid or expired token", error));
    res.status(statusCode).json(body);
  }
};
