const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../db/models/index.js");
const BlacklistedToken = db.BlacklistedToken;

const authMiddleware = async (req, res, next) => {
  console.log("in authMiddleware", req.url);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized: Token missing or malformed",
    });
  }
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token missing" });

  const blacklisted = await BlacklistedToken.findOne({ where: { token } });
  if (blacklisted) {
    return res
      .status(401)
      .json({
        error: true,
        message: "User has been logged out or Sensitive details are chaged",
      });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    console.log("in authMiddleware", req.user);

    next();
  } catch (err) {
    return res.status(403).json({
      error: true,
      message:
        err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
    });
  }
};
const adminOnly = (req, res, next) => {
  if (req.user.role != "admin") {
    return res.status(403).json({ error: true, message: "Access denied" });
  }
  next();
};

const userOnly = (req, res, next) => {
  if (req.user.role != "user") {
    return res.status(403).json({ error: true, message: "Access denied" });
  }
  next();
};
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "8h" }
  );
};
module.exports = { generateToken, authMiddleware, adminOnly, userOnly };
