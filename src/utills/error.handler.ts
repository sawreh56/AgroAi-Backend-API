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
):ApiError => {
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

const badRequest = (message: string, details?: unknown):ApiError => {
  return createApiError(400, message, "Bad Request", details);
};

const unauthorized = (message: string, details?: unknown):ApiError => {
  return createApiError(401, message, "Unauthorized", details);
};

const forbidden = (message: string, details?: unknown):ApiError => {
  return createApiError(403, message, "Forbidden", details);
};

const notFound = (message: string, details?: unknown):ApiError => {
  return createApiError(404, message, "Not Found", details);
};

const conflict = (message: string, details?: unknown):ApiError => {
  return createApiError(409, message, "Conflict", details);
};

const tooManyRequests = (message: string, details?: unknown):ApiError => {
  return createApiError(429, message, "Too Many Requests", details);
};

const internalServerError = (message: string, details?: unknown):ApiError => {
  return createApiError(500, message, "Internal Server Error", details);
};

const formatApiErrorResponse = (error: ApiError) => {
  return {
    statusCode: error.statusCode,
    body: JSON.stringify(error.body),
  };
};

const handleApiErrors = (error: unknown) => {
  console.error("API Error:", error);
  
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    return formatApiErrorResponse(error as ApiError);
  }
  
  // Handle unexpected errors gracefully
  const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: "Internal Server Error",
      message: errorMessage,
      statusCode: 500,
    }),
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
