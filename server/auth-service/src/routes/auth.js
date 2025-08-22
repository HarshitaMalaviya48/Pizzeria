const express = require("express");
const router = express.Router();

const {registration, login, logout} = require("../controller/auth.js");
const {authMiddleware} = require("../middleware/jwt.js");

router.get("/verify", authMiddleware, async(req, res) => {
    try {
    // If authMiddleware passes, req.user is already populated
    return res.status(200).json({
      success: true,
      message: "Token is valid",
      user: req.user,  // contains id, role, username, email
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
})
router.post("/create", registration);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

module.exports = router;