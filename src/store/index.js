import { configureStore } from "@reduxjs/toolkit";
import { userReducer, logoutUser } from "./slices/userSlice";
import { fileReducer } from "./slices/fileSlice";
import {
  chatReducer,
  addMessage,
  changeChatLatestMessage,
  notify,
  setActiveChat,
} from "./slices/chatSlice";
import { assetReducer } from "./slices/assetSlice";
import { mapReducer } from "./slices/mapSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
    chat: chatReducer,
    asset: assetReducer,
    map: mapReducer,
  },
});

export {
  store,
  logoutUser,
  addMessage,
  changeChatLatestMessage,
  notify,
  setActiveChat,
};

export * from "./thunks/userThunk";
export * from "./thunks/fileThunk";
export * from "./thunks/chatThunk";
export * from "./thunks/assetThunk";
export * from "./thunks/mapThunk";
