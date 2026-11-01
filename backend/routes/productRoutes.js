import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAuth } from "../lib/auth.js";

const router = express.Router();

// reads are public, writes need a logged-in user
router.get("/", getProducts);
router.get("/:id(\\d+)", getProduct);
router.post("/", requireAuth, createProduct);
router.put("/:id(\\d+)", requireAuth, updateProduct);
router.delete("/:id(\\d+)", requireAuth, deleteProduct);

export default router;
