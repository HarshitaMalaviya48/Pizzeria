const forgotPasswordService = require("../services/forgot-password.js");
const {errorResponse, successResponse} = require("../utils/responseHandler.js")

const forgotPassword = async(req, res) => {
    const {email}  = req.body;
    const result = await forgotPasswordService.forgotPassword(email)
    if(result.error){
        return errorResponse(res, result.statusCode, result.message, result.details);
    }
    return successResponse(res, result.statusCode, result.message,{link: result.resetLink});

}

const resetPassword = async(req, res) => {
    const token = req.params.token;
    const {password, confirmpassword} = req.body;
    const result = await forgotPasswordService.resetPassword(password, confirmpassword, token);
     if(result.error){
        return errorResponse(res, result.statusCode, result.message, result.details);
    }
    return successResponse(res, result.statusCode, result.message,{link: result.resetLink});
}

const verifyResetToken = async(req, res) => {
    const { token } = req.params;
    const result =  forgotPasswordService.verifyResetToken(token);
    return res.status(result.statusCode).json({...result.data})
  
}

module.exports = {forgotPassword, resetPassword, verifyResetToken}