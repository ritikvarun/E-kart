import express from "express";
import { getProductByCategoryId } from "../controllers/product.js";

const router = express.Router();
router.get("/:category", getProductByCategoryId);

export default router;
