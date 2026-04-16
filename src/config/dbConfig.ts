import mongoose from "mongoose";
import dns from "node:dns";
import { config } from "./envConfig";

export const dbConfig = async () => {
    if (config.DNS_SERVERS.length) {
        dns.setServers(config.DNS_SERVERS);
    }

    try {
        await mongoose.connect(config.DB_URL, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Error while connecting to database", err);
        throw err;
    }
};