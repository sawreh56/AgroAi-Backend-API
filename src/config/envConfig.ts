import dotenv from "dotenv";

dotenv.config();

interface Config {
    PORT: number;
    DB_URL: string;
    DNS_SERVERS: string[];
    JWT_SECRET_KEY: string;
    JWT_REFRESH_KEY: string;
    EMAIL: string;
    PASS_CODE: string;
    NODE_ENV: string;
    ALLOWED_ORIGINS: string[];
    OTP_EXPIRY_MINUTES: number;
    OTP_MAX_ATTEMPTS: number;
}

const getRequiredEnv = (key: string): string => {
    const value = process.env[key];
    if (!value || !value.trim()) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value.trim();
};

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const config: Config = {
    PORT: Number(process.env.PORT) || 4000,
    DB_URL: getRequiredEnv("DB_URL"),
    DNS_SERVERS: (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    JWT_SECRET_KEY: getRequiredEnv("JWT_SECRET_KEY"),
    JWT_REFRESH_KEY: getRequiredEnv("JWT_REFRESH_KEY"),
    EMAIL: getRequiredEnv("EMAIL"),
    PASS_CODE: getRequiredEnv("PASS_CODE"),
    NODE_ENV: process.env.NODE_ENV || "development",
    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    OTP_EXPIRY_MINUTES: parsePositiveInt(process.env.OTP_EXPIRY_MINUTES, 10),
    OTP_MAX_ATTEMPTS: parsePositiveInt(process.env.OTP_MAX_ATTEMPTS, 5),
};
