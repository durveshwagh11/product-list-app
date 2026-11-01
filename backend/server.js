import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { sql } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Render sits behind one proxy hop; needed so rate limiting sees the real client IP
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false })); // sets security-related HTTP headers
app.use(morgan("dev")); // log the request

// general API rate limit (per IP); auth routes add a stricter one
app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    message: { success: false, message: "Too many requests" },
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
  // serve our react app
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// idempotent: safe to run on every boot
async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      image TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  // Supabase exposes the public schema over its REST API using the anon key.
  // RLS with no policies blocks that path; this server's DB role owns the tables and bypasses RLS.
  await sql`ALTER TABLE users ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE products ENABLE ROW LEVEL SECURITY`;
  console.log("Database initialized successfully");
}

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize the database:", error);
    process.exit(1);
  });
