import { configureStore } from "@reduxjs/toolkit";
import { userReducer, logoutUser } from "./slices/userSlice";
import { fileReducer } from "./slices/fileSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
  },
});

export { store, logoutUser };

export * from "./thunks/userThunk";
export * from "./thunks/fileThunk";
