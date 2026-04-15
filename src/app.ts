import express  from "express";
import cors from "cors";
import router from "./routes/auth.routes";
import homeRouter from "./routes/home.routes";
import healthRouter from "./routes/health.routes";
export const app=express();

app.use(cors())
app.use(express.json());
app.use("/uploads",express.static("uploads"))

app.use("/api/health",healthRouter)
app.use("/api/auth",router)
app.use("/api/predictions",homeRouter)

export default app;