import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../api/user";

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
    const user = await userApi.post("/user/login", data);

    return user.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//get user details
const getUserDetails = createAsyncThunk("user/details", async (email) => {
  try {
    const user = await userApi.get(`/user/${email}`);

    return user.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

export { registerUser, loginUser, getUserDetails };
