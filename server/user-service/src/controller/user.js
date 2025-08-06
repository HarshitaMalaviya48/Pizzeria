const {
  getUserFromId,
  deleteUser,
  updateUser,
  updateEmail,
  updatePassword
} = require("../services/user.js");
const { successResponse, errorResponse } = require("../utils/responseHandler.js");



const getUser = async (req, res) => {
  const userId = req.headers['x-user-id'];
  console.log("in user-service get user api ", );

  const result = await getUserFromId(userId);
  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, {
    user: result.user,
  });
};



const deleteUserByItself = async (req, res) => {
  const userId = req.headers['x-user-id'];
   const token = req.headers.authorization.split(" ")[1];
  const result = await deleteUser(userId, token); 
   if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, );
}


const updateUserByItself = async (req, res) => {
   const userId = req.headers['x-user-id'];
  const newData = req.body;
  const token = req.headers.authorization.split(" ")[1];
  console.log("in user-service updateUserByItself", token);
  
  const result = await updateUser(userId, newData);
  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, {...result.user});
}

const updateEmailByUser = async(req, res) => {
   const userId = req.headers['x-user-id'];
  const email = req.body;
   const token = req.headers.authorization.split(" ")[1];
   console.log("token updateEmailByUser", token);
   

   const result = await updateEmail(userId, email, token);
    if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }
  return successResponse(res, result.status, result.message, {mustLogout: result.mustLogout});

}
const updatePasswordByUser = async(req, res) => {
   const userId = req.headers['x-user-id'];
  const passwordData = req.body;
  console.log("----------body", req.body);
  
   const token = req.headers.authorization.split(" ")[1];
   console.log("token updateEmailByUser", token);
   

   const result = await updatePassword(userId, passwordData, token);
    if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }
  return successResponse(res, result.status, result.message, {mustLogout: result.mustLogout});

}





module.exports = {  getUser, deleteUserByItself, updateUserByItself, updateEmailByUser, updatePasswordByUser};
