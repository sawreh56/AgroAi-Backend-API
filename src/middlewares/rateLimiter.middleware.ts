import { NextFunction, Request, Response } from "express";

type ClientEntry = {
  count: number;
  resetAt: number;
};

const createInMemoryRateLimiter = (windowMs: number, max: number, message: string) => {
  const clientStore = new Map<string, ClientEntry>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const existing = clientStore.get(ip);

    if (!existing || now > existing.resetAt) {
      clientStore.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (existing.count >= max) {
      return res.status(429).json({
        error: "Too Many Requests",
        message,
        statusCode: 429,
      });
    }

    existing.count += 1;
    clientStore.set(ip, existing);
    return next();
  };
};

export const generalLimiter = createInMemoryRateLimiter(
  15 * 60 * 1000,
  250,
  "Too many requests from this IP. Please try again later."
);

export const authLimiter = createInMemoryRateLimiter(
  15 * 60 * 1000,
  50,
  "Too many auth requests from this IP. Please try again later."
);

export const otpLimiter = createInMemoryRateLimiter(
  10 * 60 * 1000,
  5,
  "Too many OTP attempts from this IP. Please try again later."
);
