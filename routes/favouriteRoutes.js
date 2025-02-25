import { Router } from "express";
import User from "../models/userModel.js";
import Book from "../models/bookModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticateToken from "./userAuth.js";

const router = Router();
