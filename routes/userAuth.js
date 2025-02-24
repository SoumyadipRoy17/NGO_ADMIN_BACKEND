import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    return res.sendStatus(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_AUTH_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403).json({ message: "Forbidden" });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
