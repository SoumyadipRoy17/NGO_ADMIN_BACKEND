const router = require("express").Router();

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
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
