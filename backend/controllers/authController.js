import * as User from '../models/userModel.js';
import * as RefreshToken from '../models/refreshTokenModel.js';
import { clearSession, consumeRefreshToken, hashPassword, issueSession, verifyPassword } from '../lib/auth.js';

const serverError = (res, fn, error) => {
	console.error(`Error in ${fn} function`, error);
	res.status(500).json({ success: false, message: 'Internal Server Error' });
};

// POST /api/auth/signup
export const signup = async (req, res) => {
	const { email, password } = User.normalizeCredentials(req.body);
	const invalid = User.validateSignup({ email, password });
	if (invalid) return res.status(400).json({ success: false, message: invalid });

	try {
		const user = await User.create(email, await hashPassword(password));
		if (!user) return res.status(409).json({ success: false, message: 'Email already registered' });

		await issueSession(res, user.id);
		res.status(201).json({ success: true, data: user });
	} catch (error) {
		serverError(res, 'signup', error);
	}
};

// POST /api/auth/login
export const login = async (req, res) => {
	const { email, password } = User.normalizeCredentials(req.body);

	try {
		const user = await User.findByEmailWithHash(email);
		if (!user || !(await verifyPassword(password, user.password_hash))) {
			return res.status(401).json({ success: false, message: 'Invalid email or password' });
		}

		await RefreshToken.deleteExpiredForUser(user.id); // housekeeping
		await issueSession(res, user.id);
		res.status(200).json({ success: true, data: { id: user.id, email: user.email } });
	} catch (error) {
		serverError(res, 'login', error);
	}
};

// POST /api/auth/refresh: old refresh token is burned, a new access + refresh pair is issued
export const refresh = async (req, res) => {
	try {
		const userId = await consumeRefreshToken(req.cookies.refresh_token);
		if (!userId) {
			clearSession(res);
			return res.status(401).json({ success: false, message: 'Session expired, please log in' });
		}

		await issueSession(res, userId);
		res.status(200).json({ success: true });
	} catch (error) {
		serverError(res, 'refresh', error);
	}
};

// POST /api/auth/logout
export const logout = async (req, res) => {
	try {
		await consumeRefreshToken(req.cookies.refresh_token); // revoke server-side
	} catch (error) {
		console.error('Error in logout function', error);
	}
	clearSession(res);
	res.status(200).json({ success: true });
};

// GET /api/auth/me (logged in)
export const me = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) return res.status(401).json({ success: false, message: 'Please log in' });
		res.status(200).json({ success: true, data: user });
	} catch (error) {
		serverError(res, 'me', error);
	}
};
