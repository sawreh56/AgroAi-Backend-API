import dotenv from "dotenv"

dotenv.config();

interface config{
    PORT:number
    DB_URL:string
    DNS_SERVERS:string[]
    JWT_SECRET_KEY:string
    JWT_REFRESH_KEY:string
    EMAIL:string
    PASS_CODE:string
}

export const config:config={
    PORT:Number(process.env.PORT) || 4000 ,
    DB_URL:process.env.DB_URL || "" ,
    DNS_SERVERS:(process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
        .split(",")
        .map((item)=>item.trim())
        .filter(Boolean),
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY || "test-parctice-secret-key",
    JWT_REFRESH_KEY:process.env.JWT_REFRESH_KEY || "test-parctice-refresh-key",
    EMAIL:process.env.EMAIL || "",
    PASS_CODE:process.env.PASS_CODE || "",
}
