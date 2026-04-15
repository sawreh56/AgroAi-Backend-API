import express  from "express";
import cors from "cors";
import router from "./routes/auth.routes";
import homeRouter from "./routes/home.routes";
import healthRouter from "./routes/health.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

export const app=express();

app.use(cors())
app.use(express.json());
app.use("/uploads",express.static("uploads"))

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
    displayOperationId: true,
  },
}));

app.use("/api/health",healthRouter)
app.use("/api/auth",router)
app.use("/api/predictions",homeRouter)

export default app;