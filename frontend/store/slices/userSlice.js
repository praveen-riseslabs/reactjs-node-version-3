import { createSlice } from "@reduxjs/toolkit";
import { getUserDetails, loginUser, registerUser, resetPassword, sendPasswordResetOtp, verifyPasswordResetOtp } from "../thunks/userThunk";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    isLoggedIn: false,
    resetPass:{}
  },
  reducers: {},
  extraReducers(builder) {
    // user registration
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    });

    // user login
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    });

    // gettings user details
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    // send password reset request
    builder.addCase(sendPasswordResetOtp.fulfilled, (state, action) => {
      state.resetPass = action.payload;
    });

    // verifying password reset otp
    builder.addCase(verifyPasswordResetOtp.fulfilled, (state, action) => {
      state.resetPass = action.payload;
    });

    // reset password
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.resetPass = action.payload;
    });
  },
});

export const userReducer = userSlice.reducer;

export const { login } = userSlice.actions;
