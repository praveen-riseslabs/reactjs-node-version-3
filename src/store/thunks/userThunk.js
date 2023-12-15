import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi, userApi } from "../api/user";

//registering new user
const registerUser = createAsyncThunk("user/register", async (data) => {
  try {
    const newUser = await userApi.post("/user/register", data);
    return newUser.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//login user
const loginUser = createAsyncThunk("user/login", async (data) => {
  try {
    const user = await authApi.post("/user/login", data);

    return user.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//google login
const googleLogin = createAsyncThunk("google/login", async (data) => {
  try {
    const user = await authApi.post("/user/auth/google", data);

    return user.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//facebook login
const facebookLogin = createAsyncThunk("facebook/login", async (data) => {
  try {
    const user = await authApi.post("/user/auth/facebook", data);

    return user.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//get user details
const getUserDetails = createAsyncThunk("user/details", async (userId) => {
  try {
    const user = await userApi.get(`/user/${userId}`);

    return user.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//verify user
const verifyUser = createAsyncThunk("user/verify", async (emailToken) => {
  try {
    const verify = await userApi.post("/user/verify", { emailToken });

    return verify.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//forgot password
const requestForgotPassword = createAsyncThunk(
  "user/requestResetPassword",
  async (email) => {
    try {
      const data = await userApi.post("/user/forgotpassword", { email });

      return data.data;
    } catch (err) {
      throw Error(err.response.data.error);
    }
  }
);

//reset password
const resetPassword = createAsyncThunk("user/resetPassword", async (data) => {
  try {
    const { userId, newPassword } = data;
    await userApi.put("/user/resetpassword", { userId, newPassword });
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//update user details
const updateUserInfo = createAsyncThunk("user/update", async (data) => {
  try {
    const res = await userApi.put("/user/update", data);

    return res.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

export {
  registerUser,
  loginUser,
  getUserDetails,
  verifyUser,
  requestForgotPassword,
  resetPassword,
  googleLogin,
  facebookLogin,
  updateUserInfo,
};
