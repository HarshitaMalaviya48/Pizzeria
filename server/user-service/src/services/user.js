const axios = require("axios");
require("dotenv").config();
const BASE_URL = process.env.BASE_URL;

const getUserFromId = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-user/${userId}`);
    console.log("in getUserFromId", response.data);
    console.log("in getUserFromId", response.data.user);

    return {
      error: false,
      status: response.status,
      user: response.data.data,
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

const deleteUser = async (userId, token) => {
  try {
    console.log("in user-service deleteUser 1");
    const response = await axios.delete(`${BASE_URL}/delete/me/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
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

const updateUser = async (userId, newData) => {
  try {
    console.log("in user service updateUser 1");
    console.log("in user service updateUser 1", newData);

    const response = await axios.put(
      `${BASE_URL}/update/me/${userId}`,
      newData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("in user service updateUser 2");
    return {
      error: false,
      status: response.status,
      message: response.data.message,
      user: response.data.data,
    };
  } catch (err) {
    console.log("in updateuser", err.message);
    console.log("in updateuser", err);
    // console.log("in deleteUser", err.response);
    return {
      error: true,
      status: err.response?.status || 500,
      message: err.response?.data?.message || "server error",
      details: err.response.data.error,
    };
  }
};

const updateEmail = async(userId, email, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/email/${userId}`,
      email,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );

    console.log("in user service updateUser 2");
    return {
      error: false,
      status: response.status,
      message: response.data.message,
      mustLogout: response.data.mustLogout,
    };

  } catch (error) {
    console.log("in update email", error.message);
    console.log("in update email", error.response);
    return {
      error: true,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "server error",
      details: error.response.data.error,
    };
  }
}
const updatePassword = async(userId, passwordData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/password/${userId}`,
      passwordData,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );

    console.log("in user service updateUser 2");
    return {
      error: false,
      status: response.status,
      message: response.data.message,
      mustLogout: response.data.mustLogout,
    };

  } catch (error) {
    console.log("in update password", error.message);
    console.log("in update password", error.response);
    return {
      error: true,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "server error",
      details: error.response.data.error,
    };
  }
}



module.exports = { getUserFromId, deleteUser, updateUser, updateEmail, updatePassword };
