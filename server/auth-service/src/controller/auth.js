const {
  registerUser,
  login_user,
  logout_user
} = require("../services/auth.js");
const { successResponse, errorResponse } = require("../utils/responseHandler");


const registration = async (req, res) => {
  const result = await registerUser(req.body);

  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, {
    user: result.user,
  });
};

const login = async (req, res) => {
    const result = await login_user(req.body);

    if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message, {
    user: result.user,
    token: result.token
  });
}

const logout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const userId = req.user.id;
  const role = req.user.role;
  const result = await logout_user(userId, token, role);

  if (result.error) {
    return errorResponse(res, result.status, result.message, result.details);
  }

  return successResponse(res, result.status, result.message);
}

module.exports = {
    registration,
    login,
    logout
}