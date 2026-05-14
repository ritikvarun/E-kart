import Order from "../models/order.js";
import crypto from "crypto";
import Razorpay from "razorpay";
import Transaction from "../models/transaction.js";

const createTransaction = async (req, res) => {
  const { amount, userId } = req.body;
  const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_SECRET,
  });
  const options = {
    amount: amount,
    currency: "INR",
    receipt: `order_${Date.now()}`,
  };
  try {
    if (!amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Amount and user id required" });
    }
    const razorpayOrder = await razorpay.orders.create(options);
    res.status(201).json({
      success: true,
      message: "order created successfully",
      key: process.env.RAZOR_PAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      Order_id: razorpayOrder.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createOrder = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_signature,
    razorpay_payment_id,
    userId,
    cartItems,
    address,
    deliveryDate,
  } = req.body;
  const key_secret = process.env.RAZOR_PAY_SECRET;

  const generatedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    try {
      const transaction = await Transaction.create({
        user: userId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: "success",
        amount: cartItems.reduce(
          (total, item) => total + item?.quantity * item.price,
          0,
        ),
      });
      const order = await Order.create({
        user: userId,
        address,
        deliveryDate,
        items: cartItems?.map((item) => ({
          product: item?._id,
          quantity: item?.quantity,
        })),
        status: "Order Placed",
      });
      transaction.order = order._id;
      await transaction.save();
      res.json({
        success: true,
        message: "Payment Verified & Order Created",
        order,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: "failed to create transaction or order",
        error,
      });
    }
  }
};

const getOrderByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const order = await Order.find({ user: userId })
      .populate("user", "name email")
      .populate("items.product", "name image_uri price")
      .sort({ createdAt: -1 });
    if (!order || oarder.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch orders",
      error,
    });
  }
};

export { createTransaction,createOrder,getOrderByUserId };
