

const successResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, statusCode, message, details = null) => {
  console.log("details in errorResponse", details);
  
  const response = {
    success: false,
    message,
  };

  if (details) {
    response.error = details;
    console.log(response.error);
    
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};
