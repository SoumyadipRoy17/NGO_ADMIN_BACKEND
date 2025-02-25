import { Router } from "express";
import User from "../models/userModel.js";
import Book from "../models/bookModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticateToken from "./userAuth.js";

const router = Router();

// add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { id, bookId } = req.body;
    console.log("Received id:", id);
    console.log("Received bookId:", bookId);

    const user = await User.findById(id);
    const isBookFavourite = user.favourites.includes(bookId);

    if (isBookFavourite) {
      return res.status(400).json({ message: "Book already in favourites" });
    }

    await User.findByIdAndUpdate(id, {
      $push: { favourites: bookId },
    });

    const userdup = await User.findById(id);
    console.log(userdup.favourites);

    res.status(200).json({ message: "Book added to favourites" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete(
  "/remove-book-from-favourite",
  authenticateToken,
  async (req, res) => {
    try {
      const { id, bookId } = req.body;

      const user = await User.findById(id);
      const isBookFavourite = user.favourites.includes(bookId);

      if (!isBookFavourite) {
        return res.status(400).json({ message: "Book not in favourites" });
      }

      await User.findByIdAndUpdate(id, {
        $pull: { favourites: bookId },
      });

      res.status(200).json({ message: "Book removed from favourites" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const user = await User.findById(id).populate("favourites");

    res.status(200).json({ favourites: user.favourites });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
