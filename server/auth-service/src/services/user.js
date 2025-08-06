const jwt = require("jsonwebtoken");

const db = require("../db/models/index.js");
const User = db.User;
const BlacklistedToken = db.BlacklistedToken;
const { validateUserInput } = require("../utils/validateUserInput.js");
const { hashedPsssword } = require("../utils/passwordHelper.js");

const getUserFromId = async (userId, role) => {
  try {
    const user = await User.findOne({
      attributes: [
        "firstname",
        "lastname",
        "username",
        "email",
        "address",
        "password",
        "phoneno",
        "id",
      ],
      where: { id: userId },
    });

    if (!user) {
      return {
        error: true,
        status: 404,
        message: "User not found",
      };
    }
    return { error: false, status: 200, message: "user found", user };
  } catch (err) {
    console.log("err in getUserFromId", err);
    return {
      error: true,
      status: 500,
      message: "Database error",
      details: err.message,
    };
  }
};

const getAllUsers = async () => {
  try {
    const allUsers = await User.findAll({
      where: { role: "user" },
    });
    return {
      error: false,
      status: 200,
      message: "Users fetched successfully",
      users: allUsers,
    };
  } catch (err) {
    return {
      error: true,
      status: 500,
      message: "Failed to fetch users",
      details: err.message,
    };
  }
};

const deleteUser = async (userId, token) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return {
        error: true,
        status: 404,
        message: "User not found",
      };
    }

    if (user.role !== "user") {
      return {
        error: true,
        status: 403,
        message: "Access denied: Admin can not be delete.",
      };
    }

    const decoded = jwt.decode(token);
    console.log("decoded token", decoded);
    
    await BlacklistedToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    await User.destroy({ where: { id: userId } });
    return { error: false, status: 200, message: "User deleted successfully" };
  } catch (err) {
    console.log("in deleteUser", err.message);
    return {
      error: true,
      status: 500,
      message: "server error",
      details: err.message,
    };
  }
};

const updateUser = async (userId, newData) => {
  try {
    const { isValid, errors } = validateUserInput(newData, "update");

    if (!isValid) {
      return {
        error: true,
        status: 400,
        message: "Validation failed",
        details: errors,
      };
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return { error: true, status: 404, message: "User not found" };
    }

    if (user.role !== "user") {
      return {
        error: true,
        status: 403,
        message: "Access denied: Admin can not be update.",
      };
    }
    const updatedUser = await user.update(newData);
    console.log("updated user", updatedUser);

    return {
      error: false,
      status: 200,
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        phoneno: updatedUser.phoneno,
      },
    };
  } catch (err) {
    console.log("error in updateUser", err);
    return {
      error: true,
      status: 500,
      message: "server error",
      details: err.message,
    };
  }
};
const updateEmail = async (userId, email, token) => {
  try {
    const { isValid, errors } = validateUserInput(email, "update");

    if (!isValid) {
      return {
        error: true,
        status: 400,
        message: "Validation failed",
        details: errors,
      };
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return { error: true, status: 404, message: "User not found" };
    }

    if (user.role !== "user") {
      return {
        error: true,
        status: 403,
        message: "Access denied: Admin can not be update.",
      };
    }
    const updatedUser = await user.update(email);
    console.log("updated user", updatedUser);

    const decoded = jwt.decode(token);
    console.log("decoded token", decoded);
    
    await BlacklistedToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    return {
      error: false,
      status: 200,
      message: "Email updated successfully",
      mustLogout: true,
    };
  } catch (error) {
    console.log("error in updateUser", error);
    return {
      error: true,
      status: 500,
      message: "server error",
      details: error.message,
    };
  }
};
const updatePassword = async (userId, password, confirmpassword, token) => {
  try {
    console.log("------", password, confirmpassword);
    
    const { isValid, errors } = validateUserInput({password, confirmpassword}, "update");

    if (!isValid) {
      return {
        error: true,
        status: 400,
        message: "Validation failed",
        details: errors,
      };
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return { error: true, status: 404, message: "User not found" };
    }

    if (user.role !== "user") {
      return {
        error: true,
        status: 403,
        message: "Access denied: Admin can not be update.",
      };
    }

    const newPassword = await hashedPsssword(password);
    const updatedUser = await user.update(newPassword);
    console.log("updated user", updatedUser);

    const decoded = jwt.decode(token);
    console.log("decoded token", decoded);
    
    await BlacklistedToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    return {
      error: false,
      status: 200,
      message: "Password updated successfully",
      mustLogout: true,
    };
  } catch (error) {
    console.log("error in updateUser password", error);
    return {
      error: true,
      status: 500,
      message: "server error",
      details: error.message,
    };
  }
};

module.exports = {
  getUserFromId,
  getAllUsers,
  deleteUser,
  updateUser,
  updateEmail,
  updatePassword
};
