import express from "express";
import { createTransaction,createOrder,getOrderByUserId } from "../controllers/order.js";

const router = express.Router();
router.post("/transaction", createTransaction);
router.post("/create",createOrder)
router.get("/:userId",getOrderByUserId)

export default router;
