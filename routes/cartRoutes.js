import { Router } from "express";
import User from "../models/userModel.js";
import Book from "../models/bookModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticateToken from "./userAuth.js";

const router = Router();

// add book to cart
router.put("/add-book-to-cart", authenticateToken, async (req, res) => {
  try {
    const { id, bookId } = req.body;
    console.log("Received id:", id);
    console.log("Received bookId:", bookId);

    const user = await User.findById(id);
    const isBookInCart = user.cart.includes(bookId);

    if (isBookInCart) {
      return res.status(400).json({ message: "Book already in cart" });
    }

    await User.findByIdAndUpdate(id, {
      $push: { cart: bookId },
    });

    const userdup = await User.findById(id);
    console.log(userdup.cart);

    res.status(200).json({ message: "Book added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/remove-book-from-cart", authenticateToken, async (req, res) => {
  try {
    const { id, bookId } = req.body;

    const user = await User.findById(id);
    const isBookInCart = user.cart.includes(bookId);

    if (!isBookInCart) {
      return res.status(400).json({ message: "Book not in cart" });
    }

    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookId },
    });

    res.status(200).json({ message: "Book removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id).populate("cart");

    res.status(200).json({ cart: user.cart.reverse() });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
