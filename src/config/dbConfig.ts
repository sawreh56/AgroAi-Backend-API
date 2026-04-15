import mongoose from "mongoose"
import dns from "node:dns"
import {config}  from "./envConfig"

export const dbConfig=async()=>{
    // Force known DNS resolvers when local DNS blocks SRV/A lookups.
    if(config.DNS_SERVERS.length){
        dns.setServers(config.DNS_SERVERS)
    }

    try{
        await mongoose.connect(config.DB_URL)
        console.log("Database connected successfully")
    }
    catch(err){
        console.log("Error while connecting to database",err)
    }
}