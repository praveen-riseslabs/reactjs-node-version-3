import { createSlice } from "@reduxjs/toolkit";
import { getUserDetails, loginUser, registerUser } from "../thunks/userThunk";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    isLoggedIn: false,
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
  },
});

export const userReducer = userSlice.reducer;

export const { login } = userSlice.actions;
