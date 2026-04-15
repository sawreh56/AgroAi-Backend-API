import express from "express";
import { getHealth } from "../controllers/health.controllers";

const healthRouter = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check API Health Status
 *     description: Returns the health status of the server and database connection
 *     responses:
 *       200:
 *         description: Server and database are healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   example: "2026-04-16T10:30:45.123Z"
 *                 uptime:
 *                   type: number
 *                   example: 1234.567
 *                 environment:
 *                   type: string
 *                   example: "production"
 *                 database:
 *                   type: object
 *                   properties:
 *                     connected:
 *                       type: boolean
 *                       example: true
 *                     state:
 *                       type: string
 *                       example: "connected"
 *       503:
 *         description: Database is not connected
 *       500:
 *         description: Health check failed
 */
healthRouter.get("/", getHealth);

export default healthRouter;
