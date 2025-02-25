import { Router } from "express";
import User from "../models/userModel.js";
import Book from "../models/bookModel.js";
import Order from "../models/orderModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticateToken from "./userAuth.js";

const router = Router();

router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();

      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });

      res.status(200).json({ message: "Order placed successfully " });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const user = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });
    res.status(200).json({ orders: user.orders.reverse() });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate("user")
      .populate("book")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders: userData });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await Order.findByIdAndUpdate(id, { status: req.body.status });
    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
