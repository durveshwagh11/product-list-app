import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import * as RefreshToken from '../models/refreshTokenModel.js';

const scryptAsync = promisify(scrypt);
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET env variable is not set');

// short-lived JWT for every request + long-lived, single-use, revocable refresh token
const ACCESS_TTL_MS = 15 * 60 * 1000;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const COOKIE_OPTIONS = {
	httpOnly: true,
	sameSite: 'lax',
	secure: process.env.NODE_ENV === 'production',
};
// refresh cookie is only sent to /api/auth/*, never to the rest of the API
const REFRESH_COOKIE_OPTIONS = { ...COOKIE_OPTIONS, path: '/api/auth' };

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

// stored as "salt:hash" (hex)
export async function hashPassword(password) {
	const salt = randomBytes(16).toString('hex');
	const hash = await scryptAsync(password, salt, 64);
	return `${salt}:${hash.toString('hex')}`;
}

export async function verifyPassword(password, stored) {
	const [salt, hash] = stored.split(':');
	const candidate = await scryptAsync(password, salt, 64);
	return timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
}

// sets both cookies; only the refresh token's hash is stored, so a DB leak can't be replayed
export async function issueSession(res, userId) {
	const accessToken = jwt.sign({ sub: String(userId) }, JWT_SECRET, {
		expiresIn: ACCESS_TTL_MS / 1000,
	});
	const refreshToken = randomBytes(32).toString('hex');

	await RefreshToken.create(userId, sha256(refreshToken), new Date(Date.now() + REFRESH_TTL_MS));

	res.cookie('access_token', accessToken, {
		...COOKIE_OPTIONS,
		maxAge: ACCESS_TTL_MS,
	});
	res.cookie('refresh_token', refreshToken, {
		...REFRESH_COOKIE_OPTIONS,
		maxAge: REFRESH_TTL_MS,
	});
}

// single use: deletes the token and returns its user id, or null if unknown/expired
// ponytail: no token-family reuse detection; add a family_id column if stolen-token replay matters
export async function consumeRefreshToken(token) {
	if (!token) return null;
	const row = await RefreshToken.deleteByHash(sha256(token));
	return row && row.expires_at > new Date() ? row.user_id : null;
}

export function clearSession(res) {
	res.clearCookie('access_token', COOKIE_OPTIONS);
	res.clearCookie('refresh_token', REFRESH_COOKIE_OPTIONS);
}

export function requireAuth(req, res, next) {
	try {
		const payload = jwt.verify(req.cookies.access_token, JWT_SECRET, {
			algorithms: ['HS256'],
		});
		req.userId = Number(payload.sub);
		next();
	} catch {
		res.status(401).json({ success: false, message: 'Please log in' });
	}
}
