import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connect from "./connections/conn.js";

import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

//connection to MongoDB
connect();
const app = express();

const port = process.env.PORT || 4000;
app.use(express.json());
//routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/books", bookRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
