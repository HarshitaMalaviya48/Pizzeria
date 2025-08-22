const db = require("../db/models/index.js");
const User = db.User;

const deleteUser = async (userId, token) => {
  console.log("the userId in admin service",userId);
  
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
    const response = await fetch(`http://localhost:3004/get-orders-to-delete-user/${userId}`, {
      method: "GET",
    });

    const result = await response.json();
    console.log("result,", result);

    if(result.success && result.data.items.length > 0){
      return {
        error: true,
        status: 409,
        message: "You cannot delete User account while User still have active or past orders."
      }
    }

    await User.destroy({ where: { id: userId } });
    return { error: false, status: 200, message: "User deleted successfully" };
  } catch (err) {
    console.log("in deleteUser by admin  ", err.message);
    return {
      error: true,
      status: 500,
      message: "server error",
      details: err.message,
    };
  }
};

module.exports = { deleteUser };
