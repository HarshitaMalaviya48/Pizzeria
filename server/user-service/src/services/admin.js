const axios = require("axios");
require("dotenv").config();
const BASE_URL = process.env.BASE_URL;

const deleteUser = async (userId) => {
  try {
    console.log("in user-service deleteUser 1");
    const response = await axios.delete(
      `${BASE_URL}/delete/${userId}`
    );
    console.log("in user-service deleteUser 2", response.data);

    return {
      error: false,
      status: response.status,
      message: response.data.message,
    };
  } catch (err) {
    console.log("in deleteUser", err.message);
    console.log("in deleteUser", err.response);
    return {
      error: true,
      status: err.response?.status || 500,
      message: err.response?.data?.message || "server error",
      details: err.message,
    };
  }
};

const getAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get-users`);
    console.log("in getAllUsers", response);
  
    return {
      error: false,
      status: response.status,
      users: response.data.data,
    };
  } catch (err) {
    console.error("Error calling auth-service:", err.message);
    console.error("Error calling auth-service:", err.response);
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "Auth service call failed";
    return {
      error: true,
      status,
      message,
      details: err.message,
    };
  }
};

const updateUser = async (
  userId,
  newData,
) => {
  try {
    console.log("in user service updateUser 1");
    // console.log("in user service updateUser 1", newData);
    // console.log("in user service updateUser 1", options);
    

    const response = await axios.put(
      `${BASE_URL}/update/${userId}`,
      {
        newData
      },
    );
  
    console.log("in user service updateUser 2");
    return {
      error: false,
      status: response.status,
      message: response.data.message,
      user: response.data.data
    };
  } catch (err) {
    console.log("in deleteUser", err.message);
    // console.log("in deleteUser", err.response);
    return {
      error: true,
      status: err.response?.status || 500,
      message: err.response?.data?.message || "server error",
      details: err.message,
    };
  }
};

module.exports = {  getAllUsers, deleteUser, updateUser };
