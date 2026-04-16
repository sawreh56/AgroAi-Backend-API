import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";

import router from "./routes/auth.routes";
import homeRouter from "./routes/home.routes";
import healthRouter from "./routes/health.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { config } from "./config/envConfig";
import { generalLimiter } from "./middlewares/rateLimiter.middleware";

export const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS policy blocked this origin"));
    },
    credentials: true,
  })
);
app.use(generalLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

/* =========================
   UPLOADS FOLDER FIX (IMPORTANT FOR RAILWAY)
========================= */
const uploadsPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📁 uploads folder created");
}

/* static serve */
app.use("/uploads", express.static(uploadsPath));

/* =========================
   SWAGGER
========================= */
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
    },
  })
);

/* =========================
   ROUTES
========================= */
app.use("/api/health", healthRouter);
app.use("/api/auth", router);
app.use("/api/predictions", homeRouter);

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "Route not found",
    statusCode: 404,
  });
});

app.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({
      error: "Bad Request",
      message: error.message,
      statusCode: 400,
    });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: config.NODE_ENV === "production" ? "Unexpected server error" : error.message,
      statusCode: 500,
    });
    return;
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: "Unexpected server error",
    statusCode: 500,
  });
});