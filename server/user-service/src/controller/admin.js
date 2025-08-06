const { getAllUsers, deleteUser, updateUser } = require("../services/admin.js");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseHandler.js");

const getUsers = async (req, res) => {
  const result = await getAllUsers();
  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, {
    user: result.users,
  });
};

const deleteUserByAdmin = async (req, res) => {
  const userId = req.params.id;
  const result = await deleteUser(userId);
  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message);
};

const updateUserByAdmin = async (req, res) => {
  const userId = req.params.id;
  const newData = req.body;
  const result = await updateUser(userId, newData, {
    actingAs: "admin",
    currentToken: null,
  });
  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, {...result.user});
};

module.exports = {
  getUsers,
  deleteUserByAdmin,
  updateUserByAdmin,
};
