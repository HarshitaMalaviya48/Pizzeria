const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const db = require("../db/models/index.js");
const { User } = db;
const { sendMail } = require("../utils/sendMail.js");
const { REGEX } = require("../utils/constants.js");

const forgotPassword = async (email) => {
  try {
    if (!email) {
      return {
        error: true,
        statusCode: 400,
        message: "validation error",
        details: { email: "Email must required" },
      };
    }
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        error: true,
        statusCode: 404,
        message: "Email does not found",
        details: { email: "Email does not found" },
      };
    }

    const token = jwt.sign({ id: user.id }, process.env.RESET_SECRET_KEY, {
      expiresIn: "15m",
    });

    // const resetLink = `http://localhost:5173/reset-password/${token}`;
    const resetLink = `http://localhost:5001/reset-password/${token}`;

    await sendMail(user.email, "Password Reset", resetLink);

    return {
      error: false,
      statusCode: 200,
      message: "A reset link has been sent to your email address.",
      resetLink,
    };
  } catch (error) {
    console.log("in auth service forgot-password service", error);
    return {
      error: true,
      statusCode: 500,
      message: "Server Error",
      details: error.message,
    };
  }
};

const resetPassword = async (password, confirmpassword, token) => {
  try {
    const errors = {};
    if (!password) {
      errors.password = "Password must required";
    } else if (!REGEX.PASSWORD.test(password)) {
      errors.password =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
    }
    console.log("---------------", password, confirmpassword);
    
    if (!confirmpassword) {
      errors.confirmpassword = "Confirm Password is required";
    } else if (password !== confirmpassword) {
      console.log("in do not match block");
      
      errors.confirmpassword = "Password do not match";
    }
    if (Object.keys(errors).length > 0) {
      return {
        error: true,
        statusCode: 400,
        message: "Validation failed",
        details: errors,
      };
    }
    const decoded = jwt.verify(token, process.env.RESET_SECRET_KEY);

    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return {
        error: true,
        statusCode: 404,
        message: "User does not found",
        details: {},
      };
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    return {
      error: false,
      statusCode: 200,
      message: "Password reset successfully.",
    };
  } catch (error) {
    console.log("in auth service reset-password service", error);
    return {
      error: true,
      statusCode: 401,
      message: "Invalid or expired token",
      details: error.message,
    };
  }
};

const verifyResetToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.RESET_SECRET_KEY);
    return {
      statusCode: 200,
      data: { valid: true, userId: payload.id },
    };
  } catch (err) {
    return {
      statusCode: 401,
      data: {
        valid: false,
        message: "Invalid or expired token",
      },
    };
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  verifyResetToken,
};
