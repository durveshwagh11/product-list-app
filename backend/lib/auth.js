import "dotenv/config";
import jwt from "jsonwebtoken";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET env variable is not set");

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

// stored as "salt:hash" (hex)
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scryptAsync(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const candidate = await scryptAsync(password, salt, 64);
  return timingSafeEqual(candidate, Buffer.from(hash, "hex"));
}

export function setAuthCookie(res, userId) {
  const token = jwt.sign({ sub: String(userId) }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, { ...COOKIE_OPTIONS, maxAge: SESSION_MS });
}

export function clearAuthCookie(res) {
  res.clearCookie("token", COOKIE_OPTIONS);
}

export function requireAuth(req, res, next) {
  try {
    req.userId = Number(
      jwt.verify(req.cookies.token, JWT_SECRET, { algorithms: ["HS256"] }).sub,
    );
    next();
  } catch {
    res.status(401).json({ success: false, message: "Please log in" });
  }
}
