import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connect from "./connections/conn.js";
connect();
const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
