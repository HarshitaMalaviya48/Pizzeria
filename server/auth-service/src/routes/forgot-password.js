const express = require("express");
const router = express.Router();

const {forgotPassword, resetPassword, verifyResetToken} = require("../controller/forgot-password.js")

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get('/verify-reset-token/:token', verifyResetToken);


module.exports = router;