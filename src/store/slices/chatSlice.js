import { createSlice } from "@reduxjs/toolkit";
import {
  createChat,
  fetchChats,
  fetchMessages,
  searchForUser,
  sendMessage,
} from "../thunks/chatThunk";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    filteredUser: [],
    chats: [],
    activeChatMessages: [],
  },
  extraReducers(builder) {
    //searched user list
    builder.addCase(searchForUser.fulfilled, (state, action) => {
      state.filteredUser = action.payload;
    });

    //fetch all chats
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.chats = action.payload;
    });

    //searched user list
    builder.addCase(createChat.fulfilled, (state, action) => {
      !state.chats.some((ch) => ch._id === action.payload._id) &&
        state.chats.push(action.payload);
    });

    //fetch all messages of active chat
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.activeChatMessages = action.payload;
    });

    //send message
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.activeChatMessages.push(action.payload);
    });
  },
});

export const chatReducer = chatSlice.reducer;
