import "dotenv/config";
import postgres from "postgres";

// Supabase: Project Settings -> Database -> Connection string (pooler URI)
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL env variable is not set");

export const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
