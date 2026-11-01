import { sql } from '../config/db.js';

// idempotent: safe to run on every boot
export async function initSchema() {
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
}
