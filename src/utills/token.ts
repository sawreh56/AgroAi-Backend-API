import jwt from "jsonwebtoken";
import { config } from "../config/envConfig";

type TokenPayload = {
  email: string;
};

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.JWT_SECRET_KEY) as TokenPayload;
};
