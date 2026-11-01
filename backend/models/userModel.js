import { sql } from '../config/db.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeCredentials = (body) => ({
	email: String(body.email ?? '')
		.trim()
		.toLowerCase(),
	password: String(body.password ?? ''),
});

// returns an error message, or null when valid (signup rules)
export const validateSignup = ({ email, password }) => {
	if (!EMAIL_RE.test(email)) return 'Enter a valid email';
	if (password.length < 8) return 'Password must be at least 8 characters';
	return null;
};

// returns undefined when the email is already registered
export const create = async (email, passwordHash) => {
	const [user] = await sql`
		INSERT INTO users (email, password_hash)
		VALUES (${email}, ${passwordHash})
		ON CONFLICT (email) DO NOTHING
		RETURNING id, email
	`;
	return user;
};

// includes password_hash: only for credential checks, never send it to the client
export const findByEmailWithHash = async (email) => {
	const [user] = await sql`SELECT id, email, password_hash FROM users WHERE email = ${email}`;
	return user;
};

export const findById = async (id) => {
	const [user] = await sql`SELECT id, email FROM users WHERE id = ${id}`;
	return user;
};
