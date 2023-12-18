import { createSlice } from "@reduxjs/toolkit";
import {
  createChat,
  createGroupChat,
  fetchChats,
  fetchMessages,
  searchForUser,
  sendMessage,
  renameGroupChat,
  addUserToGroupChat,
  removeUserFromGroupChat,
  deleteGroup,
} from "../thunks/chatThunk";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    filteredUser: [],
    chats: [],
    activeChatMessages: [],
    activeChat: {},
    notifications: [],
  },
  reducers: {
    //push new recieved messages
    addMessage(state, action) {
      state.activeChatMessages.push(action.payload);
    },

    //push new recieved messages
    notify(state, action) {
      !state.notifications.some((n) => n._id === action.payload._id) &&
        state.notifications.push(action.payload);
    },

    //push new recieved messages
    changeChatLatestMessage(state, action) {
      const newMsg = {
        ...action.payload,
        sender: action.payload.sender.userId,
      };

      state.chats = state.chats.map((chat) =>
        chat._id === newMsg.chatId ? { ...chat, latestMessage: newMsg } : chat
      );
    },

    //change active chat
    setActiveChat(state, action) {
      if (action.payload.hasOwnProperty("users")) {
        state.activeChat = action.payload;
        state.notifications = state.notifications.filter(
          (notif) => notif.chatId !== action.payload._id
        );
      } else {
        const chat = state.chats.find(
          (chat) => chat._id === action.payload._id
        );

        state.activeChat = chat;

        state.notifications = state.notifications.filter(
          (notif) => notif.chatId !== action.payload._id
        );
      }
    },
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

    //create one-to-one chat
    builder.addCase(createChat.fulfilled, (state, action) => {
      !state.chats.some((ch) => ch._id === action.payload._id) &&
        state.chats.push(action.payload);
    });

    //create group chat
    builder.addCase(createGroupChat.fulfilled, (state, action) => {
      state.chats.push(action.payload);
      state.newChatGroupCreated = true;
    });

    //fetch all messages of active chat
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.activeChatMessages = action.payload;
    });

    //send message
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.activeChatMessages.push(action.payload);
    });

    //rename group chat
    builder.addCase(renameGroupChat.fulfilled, (state, action) => {
      state.chats = state.chats.map((chat) =>
        chat._id === action.payload._id
          ? { ...chat, chatName: action.payload.chatName }
          : chat
      );
    });

    //add or remove user from group chat
    builder
      .addCase(addUserToGroupChat.fulfilled, (state, action) => {
        state.chats = state.chats.map((chat) =>
          chat._id === action.payload._id
            ? { ...chat, users: action.payload.users }
            : chat
        );
      })
      .addCase(removeUserFromGroupChat.fulfilled, (state, action) => {
        state.chats = state.chats.map((chat) =>
          chat._id === action.payload._id
            ? { ...chat, users: action.payload.users }
            : chat
        );
      });

    //delete group
    builder.addCase(deleteGroup.fulfilled, (state, action) => {
      state.chats = state.chats.map((chat) => chat._id !== action.payload._id);
    });
  },
});

export const chatReducer = chatSlice.reducer;
export const { addMessage, changeChatLatestMessage, notify, setActiveChat } =
  chatSlice.actions;
