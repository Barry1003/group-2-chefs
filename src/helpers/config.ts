import { configDotenv } from "dotenv";

configDotenv();

const config = {
    nodeEnv: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || "",
    API_ROUTE: process.env.API_ROUTE || "/api/v1"
}

export default config