const {getAllUsers, deleteUser, updateUser} = require("../services/user.js");
const {errorResponse, successResponse} = require("../utils/responseHandler.js")
const adminService = require("../services/admin.js");

const getUser = async (req, res) => {
  const userId = req.params.id;
  console.log("in user-service get user api ", userId);

  const result = await getUserFromId(userId);
  console.log();
  
  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, {
    user: result.user,
  });
};

const getUsers = async (req, res) => {
  const result = await getAllUsers();
  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, 
     result.users,);
};

const deleteUserByAdmin = async(req, res) => {
  const userId = req.params.id;
  const result = await adminService.deleteUser(userId); 
   if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, );
}

const updateUserByAdmin = async (req, res) => {
  const userId = req.params.id;
  const newData = req.body.newData;
  const result = await updateUser(userId, newData, {actingAs: "admin", currentToken: null});
  if (result.error) {
      console.log("validation error in controller", result.details);

    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, {user: result.user, mustLogout: result.mustLogOut});
}

module.exports = {getUser,   getUsers, deleteUserByAdmin, updateUserByAdmin};
