import * as Product from '../models/productModel.js';

const NOT_FOUND = { success: false, message: 'Product not found' };
const NOT_FOUND_OR_NOT_OWNED = { success: false, message: 'Product not found or not yours' };
const INVALID = { success: false, message: Product.INVALID_PRODUCT_MESSAGE };

const serverError = (res, fn, error) => {
	console.error(`Error in ${fn} function`, error);
	res.status(500).json({ success: false, message: 'Internal Server Error' });
};

// GET /api/products
export const getProducts = async (req, res) => {
	try {
		res.status(200).json({ success: true, data: await Product.findAll() });
	} catch (error) {
		serverError(res, 'getProducts', error);
	}
};

// GET /api/products/:id
export const getProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) return res.status(404).json(NOT_FOUND);
		res.status(200).json({ success: true, data: product });
	} catch (error) {
		serverError(res, 'getProduct', error);
	}
};

// POST /api/products (logged in)
export const createProduct = async (req, res) => {
	const fields = Product.validate(req.body);
	if (!fields) return res.status(400).json(INVALID);

	try {
		res.status(201).json({ success: true, data: await Product.create(fields, req.userId) });
	} catch (error) {
		serverError(res, 'createProduct', error);
	}
};

// PUT /api/products/:id (owner only)
export const updateProduct = async (req, res) => {
	const fields = Product.validate(req.body);
	if (!fields) return res.status(400).json(INVALID);

	try {
		const product = await Product.updateOwned(req.params.id, req.userId, fields);
		if (!product) return res.status(404).json(NOT_FOUND_OR_NOT_OWNED);
		res.status(200).json({ success: true, data: product });
	} catch (error) {
		serverError(res, 'updateProduct', error);
	}
};

// DELETE /api/products/:id (owner only)
export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.deleteOwned(req.params.id, req.userId);
		if (!product) return res.status(404).json(NOT_FOUND_OR_NOT_OWNED);
		res.status(200).json({ success: true, data: product });
	} catch (error) {
		serverError(res, 'deleteProduct', error);
	}
};
