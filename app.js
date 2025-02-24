import express from "express";

const app = express();

const port = app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
