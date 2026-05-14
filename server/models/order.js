import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deliveryDate: { type: Date, required: true },
  items: { type: [orderItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: [
      "Order placed",
      "Shipping",
      "Out for delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Order placed",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
