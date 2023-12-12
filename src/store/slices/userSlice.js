import { createSlice } from "@reduxjs/toolkit";
import {
  getUserDetails,
  googleLogin,
  loginUser,
  registerUser,
  requestForgotPassword,
  verifyUser,
} from "../thunks/userThunk";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    loggedIn: false,
    isVerified: false,
    emailSent: false,
  },
  reducers: {
    //user logout
    logoutUser(state, action) {
      state.user = {};
      state.loggedIn = false;
      state.emailSent = false;
    },
  },
  extraReducers(builder) {
    //case : registering new user
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    //case : login user
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loggedIn = true;
    });

    //case : get user details
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loggedIn = true;
    });

    //case : verify user
    builder.addCase(verifyUser.fulfilled, (state, action) => {
      action.payload.msg = "success"
        ? (state.isVerified = true)
        : (state.isVerified = false);
    });

    //case : send reset password link
    builder.addCase(requestForgotPassword.fulfilled, (state, action) => {
      action.payload.msg = "success"
        ? (state.emailSent = true)
        : (state.emailSent = false);
    });

    // case: login through google SSO
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loggedIn = true;
    });
  },
});

export const userReducer = userSlice.reducer;
export const { logoutUser } = userSlice.actions;
