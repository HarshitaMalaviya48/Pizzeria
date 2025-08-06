const jwt = require("jsonwebtoken");
const {
  validateUserInput,
  validLoginInput,
} = require("../utils/validateUserInput.js");
const {
  hashedPsssword,
  comparePassword,
} = require("../utils/passwordHelper.js");
const { generateToken } = require("../middleware/jwt.js");
const db = require("../db/models/index.js");
const User = db.User;
const BlacklistedToken = db.BlacklistedToken;

const registerUser = async (userData) => {
  const { isValid, errors } = validateUserInput(userData);
  if (!isValid) {
    return {
      error: true,
      status: 400,
      message: "Validation failed",
      details: errors,
    };
  }

  const hashPassword = await hashedPsssword(userData.password);
  const finalUser = { ...userData, password: hashPassword };

  try {
    const user = await User.create(finalUser);
    return {
      error: false,
      status: 201,
      message: "User registered successfully",
      user,
    };
  } catch (err) {
    console.log("error in auth-service services", err);
    
    if (err.name === "SequelizeUniqueConstraintError") {
      const field = err.errors[0].path;
      return {
        error: true,
        status: 409,
        message: `${field} already exists`,
      };
    }

    return {
      error: true,
      status: 500,
      message: "Database error",
      details: err.message,
    };
  }
};

const login_user = async (userData) => {
  try {
    const { email, password } = userData;
  const { isValid, errors } = validLoginInput(userData);
  if (!isValid) {
    return {
      error: true,
      status: 400,
      message: "Validation failed",
      details: errors,
    };
  }

  const user = await User.findOne({
    where: { email: email },
  });
  console.log("----------------1");
  

  if (!user) {
    return {
      error: true,
      status: 404,
      message: "Invalid credential",
    };
  }

  const isMatched = await comparePassword(user.password, password);
  console.log("----------------2");

  if (!isMatched) {
    return {
      error: true,
      status: 401,
      message: "Invalid credential",
    };
  }

  const token = generateToken(user);

  return {
    error: false,
    status: 200,
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
    },
    token,
  };
  } catch (error) {
     console.log("error in auth-service services", error);
     return {
      error: true,
      status: 500,
      message: "Database error",
      details: error.message,
    };
  }
  
};

const logout_user = async (userId, token, role) => {
  // if (role !== "user") {
  //   return {
  //     error: true,
  //     status: 403,
  //     message: "Access denied: This route is only accessible by users.",
  //   };
  // }
  if (!token) {
    return {
      error: true,
      status: 400,
      message: "No token provided",
    };
  }

  const decoded = jwt.decode(token);
  await BlacklistedToken.create({
    token,
    expiresAt: new Date(decoded.exp * 1000),
  });

  return {
    error: false,
    status: 200,
    message: "logout successfully",
  };
};

module.exports = {
  registerUser,
  login_user,
  logout_user,
};
