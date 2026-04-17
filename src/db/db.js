import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

export { db };