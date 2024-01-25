import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../api";

//register new user
const registerUser = createAsyncThunk("user/register", async (data) => {
  try {
    const res = await userApi.post("/register", data);
   await useTimer(2)
    return res.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

async function useTimer(d) {
  return new Promise((res) => {
    setTimeout(res, d * 1000);
  });
}

//login user
const loginUser = createAsyncThunk("user/login", async (data) => {
  try {
    const { usernameOrEmail, password } = data;

    const res = await userApi.post("/login", { usernameOrEmail, password });
    return res.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//get user details
const getUserDetails = createAsyncThunk("user/details", async () => {
  try {
    const res = await userApi.get("/");
    return res.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

export { registerUser, loginUser, getUserDetails };
