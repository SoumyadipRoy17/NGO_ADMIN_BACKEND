import { Router } from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticateToken from "./userAuth.js";

const router = Router();

//Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    //check username length is more than 4
    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username must be more than 4 characters" });
    }

    //check usernam elaready exists
    const existingUsername = await User.findOne({ username: username });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //check email already exists
    const existingEmail = await User.findOne({ email: email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    //check password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be more than 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    //check address length
    if (address.length < 5) {
      return res
        .status(400)
        .json({ message: "Address must be more than 5 characters" });
    }

    const user = new User({
      username,
      email,
      password: hashedPassword,
      address,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//Sign In
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      res.status(400).json({ message: "Invalid credentials!" });
    }

    await bcrypt.compare(password, existingUser.password, (err, data) => {
      if (data) {
        const authClaims = [
          { name: existingUser.username },
          { role: existingUser.role },
        ];
        const token = jwt.sign({ authClaims }, process.env.JWT_AUTH_KEY, {
          expiresIn: "30d",
        });
        res
          .status(200)
          .json({ id: existingUser._id, role: existingUser.role, token });
      } else {
        res.status(400).json({ message: "Invalid credentials!" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

//Get all users
router.get("/get-user-info", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const users = await User.findById(id).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//update address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;

    await User.findByIdAndUpdate(id, { address });
    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
