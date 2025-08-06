const express = require("express");
const router = express.Router();

const {registration, login, logout} = require("../controller/auth.js");
const {authMiddleware} = require("../middleware/jwt.js")

router.post("/create", registration);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

module.exports = router;