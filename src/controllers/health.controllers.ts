import { Request, Response } from "express";
import mongoose from "mongoose";

export const getHealth = async (req: Request, res: Response) => {
  try {
    // Check database connection status
    const dbStatus = mongoose.connection.readyState;
    
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbConnected = dbStatus === 1;

    const healthStatus = {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database: {
        connected: dbConnected,
        state: getConnectionState(dbStatus),
      },
      server: {
        memory: process.memoryUsage(),
        pid: process.pid,
      },
    };

    const statusCode = dbConnected ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      message: "Health check failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Helper function to convert readyState to readable format
function getConnectionState(state: number): string {
  const states: { [key: number]: string } = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return states[state] || "unknown";
}
