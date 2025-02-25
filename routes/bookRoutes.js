import { Router } from "express";
import User from "../models/userModel.js";
import Book from "../models/bookModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticateToken from "./userAuth.js";

const router = Router();

//add book --admin

router.get("/get-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { url, title, author, price, desc, language } = req.body;

    const { id } = req.headers;
    const isAdmin = await User.findById(id);

    if (isAdmin.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You are not authorized to add book  " });
    }

    const book = new Book({
      url,
      title,
      author,
      price,
      desc,
      language,
    });

    await book.save();

    res.status(201).json({ message: "Book added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const isAdmin = await User.findById(id);

    if (isAdmin.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You are not authorized to update book " });
    }

    const { url, title, author, price, desc, language } = req.body;

    await Book.findByIdAndUpdate(bookid, {
      url,
      title,
      author,
      price,
      desc,
      language,
    });

    res.status(201).json({ message: "Book updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const isAdmin = await User.findById(id);

    if (isAdmin.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You are not authorized to delete book " });
    }

    await Book.findByIdAndDelete(bookid);

    res.status(201).json({ message: "Book deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
