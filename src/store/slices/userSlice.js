import { createSlice } from "@reduxjs/toolkit";
import {
  getUserDetails,
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
    emailSent: false
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
  },
});

export const userReducer = userSlice.reducer;
