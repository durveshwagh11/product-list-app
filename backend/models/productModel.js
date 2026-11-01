import { sql } from '../config/db.js';

export const INVALID_PRODUCT_MESSAGE = 'Name, a valid price and an http(s) image URL are required';

// returns clean fields, or null when invalid
export const validate = ({ name, price, image }) => {
	const cleanName = String(name ?? '').trim();
	const cleanImage = String(image ?? '').trim();
	const cleanPrice = Number(price);

	if (
		!cleanName ||
		!/^https?:\/\/\S+$/.test(cleanImage) ||
		price === '' ||
		price == null ||
		!Number.isFinite(cleanPrice) ||
		cleanPrice < 0 ||
		cleanPrice >= 1e8 // DECIMAL(10, 2) limit
	) {
		return null;
	}
	return { name: cleanName, price: cleanPrice, image: cleanImage };
};

export const findAll = () => sql`
	SELECT * FROM products
	ORDER BY created_at DESC
`;

export const findById = async (id) => {
	const [product] = await sql`SELECT * FROM products WHERE id = ${id}`;
	return product;
};

export const create = async ({ name, price, image }, userId) => {
	const [product] = await sql`
		INSERT INTO products (name, price, image, user_id)
		VALUES (${name}, ${price}, ${image}, ${userId})
		RETURNING *
	`;
	return product;
};

// ownership is part of the WHERE clause: returns undefined if missing or not owned
export const updateOwned = async (id, userId, { name, price, image }) => {
	const [product] = await sql`
		UPDATE products
		SET name = ${name}, price = ${price}, image = ${image}
		WHERE id = ${id} AND user_id = ${userId}
		RETURNING *
	`;
	return product;
};

export const deleteOwned = async (id, userId) => {
	const [product] = await sql`
		DELETE FROM products
		WHERE id = ${id} AND user_id = ${userId}
		RETURNING *
	`;
	return product;
};
