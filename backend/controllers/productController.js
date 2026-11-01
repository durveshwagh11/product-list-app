import { sql } from "../config/db.js";

// returns clean fields, or null when invalid
const parseProduct = ({ name, price, image }) => {
  const cleanName = String(name ?? "").trim();
  const cleanImage = String(image ?? "").trim();
  const cleanPrice = Number(price);

  if (
    !cleanName ||
    !/^https?:\/\/\S+$/.test(cleanImage) ||
    price === "" ||
    price == null ||
    !Number.isFinite(cleanPrice) ||
    cleanPrice < 0 ||
    cleanPrice >= 1e8 // DECIMAL(10, 2) limit
  ) {
    return null;
  }
  return { name: cleanName, price: cleanPrice, image: cleanImage };
};

const INVALID_MESSAGE =
  "Name, a valid price and an http(s) image URL are required";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC;
    `;
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error in getProducts function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Create a new product owned by the logged-in user
export const createProduct = async (req, res) => {
  const product = parseProduct(req.body);
  if (!product) {
    return res.status(400).json({ success: false, message: INVALID_MESSAGE });
  }

  try {
    const [newProduct] = await sql`
      INSERT INTO products (name, price, image, user_id)
      VALUES (${product.name}, ${product.price}, ${product.image}, ${req.userId})
      RETURNING *;
    `;
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in createProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get a single product by ID
export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await sql`
      SELECT * FROM products WHERE id=${id};
    `;

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error in getProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update a product by ID (owner only)
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = parseProduct(req.body);
  if (!product) {
    return res.status(400).json({ success: false, message: INVALID_MESSAGE });
  }

  try {
    const [updatedProduct] = await sql`
      UPDATE products
      SET name=${product.name}, price=${product.price}, image=${product.image}
      WHERE id=${id} AND user_id=${req.userId}
      RETURNING *;
    `;

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found or not yours" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error in updateProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a product by ID (owner only)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [deletedProduct] = await sql`
      DELETE FROM products WHERE id=${id} AND user_id=${req.userId} RETURNING *;
    `;

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found or not yours" });
    }

    res.status(200).json({ success: true, data: deletedProduct });
  } catch (error) {
    console.error("Error in deleteProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
