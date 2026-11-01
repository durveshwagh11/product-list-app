import { sql } from "../config/db.js";
import {
  clearAuthCookie,
  hashPassword,
  setAuthCookie,
  verifyPassword,
} from "../lib/auth.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const readCredentials = (body) => ({
  email: String(body.email ?? "")
    .trim()
    .toLowerCase(),
  password: String(body.password ?? ""),
});

export const signup = async (req, res) => {
  const { email, password } = readCredentials(req.body);
  if (!EMAIL_RE.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Enter a valid email" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Password must be at least 8 characters",
      });
  }

  try {
    const [user] = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${await hashPassword(password)})
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email;
    `;
    if (!user) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }
    setAuthCookie(res, user.id);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error("Error in signup function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = readCredentials(req.body);

  try {
    const [user] =
      await sql`SELECT id, email, password_hash FROM users WHERE email=${email};`;
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    setAuthCookie(res, user.id);
    res
      .status(200)
      .json({ success: true, data: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Error in login function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ success: true });
};

export const me = async (req, res) => {
  try {
    const [user] =
      await sql`SELECT id, email FROM users WHERE id=${req.userId};`;
    if (!user)
      return res.status(401).json({ success: false, message: "Please log in" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error in me function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
