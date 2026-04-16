import { app } from "./app";
import { dbConfig } from "./config/dbConfig";
import { config } from "./config/envConfig";

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

async function startServer() {
  try {
    await dbConfig();

    app.listen(config.PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port: ${config.PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
}

startServer();