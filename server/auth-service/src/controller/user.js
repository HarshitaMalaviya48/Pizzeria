const {
  getUserFromId,
  getAllUsers,
  deleteUser,
  updateUser,
  updateEmail,
  updatePassword
} = require("../services/user.js");
const { successResponse, errorResponse } = require("../utils/responseHandler");



const getUser = async (req, res) => {
  const userId = req.params.id;
 
  const result = await getUserFromId(userId);
  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, 
    result.user,
  );
};



const deleteUserByItself = async (req, res) => {
  const userId = req.params.id;  
  const token = req.headers.authorization?.split(" ")[1];
  const result = await deleteUser(userId, token); 
   if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, );
}



const updateUserByItself = async (req, res) => {
  console.log("in auth service updateUserByItself controller");
  
  const userId = req.params.id;
  console.log("problemmmmmmmmmmm",req.body);
  const newData = req.body;
  console.log("header", req.headers);
 
 
  
  console.log("in auth service updateUserByItself", newData);
 
  
  const result = await updateUser(userId, newData);
  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, {user: result.user});
}

const updateEmailByUser = async(req, res) => {
  const userId = req.params.id;
  const email = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token updateEmailByUser", token);
  const result = await updateEmail(userId, email, token);

  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, { mustLogout: result.mustLogOut});
}
const updatePasswordByUser = async(req, res) => {
  const userId = req.params.id;
  const {password, confirmpassword} = req.body;
  console.log("-------body", req.body);
  
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token updateEmailByUser", token);
  const result = await updatePassword(userId, password, confirmpassword, token);

  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, { mustLogout: result.mustLogOut});
}


module.exports = {  getUser, deleteUserByItself, updateUserByItself, updateEmailByUser, updatePasswordByUser};
