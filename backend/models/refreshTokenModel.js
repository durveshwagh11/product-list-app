import { sql } from '../config/db.js';

// only the SHA-256 hash of a refresh token is ever stored
export const create = (userId, tokenHash, expiresAt) => sql`
	INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
	VALUES (${userId}, ${tokenHash}, ${expiresAt})
`;

// deletes and returns the row in one step, which is what makes tokens single-use
export const deleteByHash = async (tokenHash) => {
	const [row] = await sql`
		DELETE FROM refresh_tokens
		WHERE token_hash = ${tokenHash}
		RETURNING user_id, expires_at
	`;
	return row;
};

export const deleteExpiredForUser = (userId) => sql`
	DELETE FROM refresh_tokens
	WHERE user_id = ${userId} AND expires_at < now()
`;
