import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

import router from "./routes/auth.routes";
import homeRouter from "./routes/home.routes";
import healthRouter from "./routes/health.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

export const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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