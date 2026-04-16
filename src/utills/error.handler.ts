import { config } from "../config/envConfig";

export type ErrorBody = {
  error: string;
  message: string;
  details?: unknown;
  statusCode: number;
};

export type ApiError = {
  statusCode: number;
  body: ErrorBody;
};

const createApiError = (
  statusCode: number,
  message: string,
  errorType: string,
  details?: unknown
): ApiError => {
  return {
    statusCode,
    body: {
      error: errorType,
      message,
      statusCode,
      details,
    },
  };
};

const badRequest = (message: string, details?: unknown): ApiError =>
  createApiError(400, message, "Bad Request", details);

const unauthorized = (message: string, details?: unknown): ApiError =>
  createApiError(401, message, "Unauthorized", details);

const forbidden = (message: string, details?: unknown): ApiError =>
  createApiError(403, message, "Forbidden", details);

const notFound = (message: string, details?: unknown): ApiError =>
  createApiError(404, message, "Not Found", details);

const conflict = (message: string, details?: unknown): ApiError =>
  createApiError(409, message, "Conflict", details);

const tooManyRequests = (message: string, details?: unknown): ApiError =>
  createApiError(429, message, "Too Many Requests", details);

const internalServerError = (message: string, details?: unknown): ApiError =>
  createApiError(500, message, "Internal Server Error", details);

/**
 * 🔥 IMPORTANT FIX:
 * ❌ DO NOT stringify here
 * Express will handle JSON serialization
 */
const handleApiErrors = (error: unknown) => {
  console.error("API Error:", error);

  // If it's already our ApiError
  if (typeof error === "object" && error !== null && "statusCode" in error) {
    const err = error as ApiError;

    return {
      statusCode: err.statusCode,
      body: err.body, // 👈 NO stringify
    };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: string }).name === "ValidationError"
  ) {
    const validationError = error as {
      errors?: Record<string, { message?: string }>;
    };

    const messages = validationError.errors
      ? Object.values(validationError.errors)
          .map((item) => item?.message)
          .filter((message): message is string => Boolean(message))
      : ["Validation failed"];

    return {
      statusCode: 400,
      body: {
        error: "Bad Request",
        message: messages.join(", "),
        statusCode: 400,
      },
    };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    return {
      statusCode: 409,
      body: {
        error: "Conflict",
        message: "Duplicate value found for a unique field",
        statusCode: 409,
      },
    };
  }

  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return {
    statusCode: 500,
    body: {
      error: "Internal Server Error",
      message:
        config.NODE_ENV === "production" ? "An unexpected error occurred" : errorMessage,
      statusCode: 500,
    },
  };
};

export const apiErrors = {
  badRequest,
  notFound,
  internalServerError,
  unauthorized,
  forbidden,
  conflict,
  tooManyRequests,
  handleApiErrors,
};