import dotenv from "dotenv";
dotenv.config();
import express from "express";
import userRouter from "./routes/user.js";
import categoryRouter from "./routes/category.js";
import productRouter from "./routes/product.js";
import orderRouter from "./routes/order.js";
import connectDB from "./config/connect.js";
const app = express();
app.use(express.json());
// routes
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);


const start = async () => {
  await connectDB(process.env.MONGO_URI);
  try {
    app.listen({ port: 7000, host: "0.0.0.0" }, (err, addr) => {
      if (err) {
        console.log(err);
      } else {
        console.log("server started on http://localhost:7000/");
      }
    });
  } catch (error) {
    console.log("Error Starting Server", error);
  }
};
start();
