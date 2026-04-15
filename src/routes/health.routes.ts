import express from "express";
import { getHealth } from "../controllers/health.controllers";

const healthRouter = express.Router();

// Health check endpoint
healthRouter.get("/", getHealth);

export default healthRouter;
