import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["cash_on_delivery", "upi", "card"],
    required: true,
  },
  orderId: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    default: "pending",
  },
  transactionId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
