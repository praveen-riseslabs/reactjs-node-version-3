import { configureStore } from "@reduxjs/toolkit";
import { userReducer, logoutUser } from "./slices/userSlice";
import { fileReducer } from "./slices/fileSlice";
import { chatReducer } from "./slices/chatSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
    chat: chatReducer,
  },
});

export { store, logoutUser };

export * from "./thunks/userThunk";
export * from "./thunks/fileThunk";
export * from "./thunks/chatThunk";
