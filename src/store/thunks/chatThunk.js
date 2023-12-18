import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../api/user";
import { chatApi } from "../api/chat";

//search for users
const searchForUser = createAsyncThunk("search/people", async (term) => {
  try {
    const { token } = JSON.parse(localStorage.getItem("user"));
    const users = await userApi.get("/user/search/people", {
      headers: {
        Authorization: "Bearer " + token,
      },
      params: {
        search: term,
      },
    });

    return users.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//create one-to-one chats
const createChat = createAsyncThunk("chat/single", async (userId) => {
  try {
    const newChat = await chatApi.post("/create/single", { userId });
    return newChat.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//create group chats
const createGroupChat = createAsyncThunk("chat/group", async (data) => {
  try {
    const newGroupChat = await chatApi.post("/create/group", data);
    return newGroupChat.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//fetch all chats/users
const fetchChats = createAsyncThunk("fetch/chats", async () => {
  try {
    const chats = await chatApi.get("/");
    return chats.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//rename group
const renameGroupChat = createAsyncThunk("rename/group", async (data) => {
  try {
    const chats = await chatApi.put("/group/rename", data);
    return chats.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//add user to group
const addUserToGroupChat = createAsyncThunk("addUser/group", async (data) => {
  try {
    const chats = await chatApi.put("/group/add", data);
    return chats.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//remove user from group
const removeUserFromGroupChat = createAsyncThunk(
  "removeUser/group",
  async (data) => {
    try {
      const chats = await chatApi.put("/group/remove", data);
      return chats.data;
    } catch (err) {
      throw Error(err.response.data.error);
    }
  }
);

//delete group
const deleteGroup = createAsyncThunk("chat/remove", async (data) => {
  try {
    const { chatId, adminId } = data;
    const chats = await chatApi.delete("/delete/group", { chatId, adminId });
    return chats.data;
  } catch (err) {
    console.log(err);
    throw Error(err.response.data.error);
  }
});

//fetch all conversations of specific chat
const fetchMessages = createAsyncThunk("fetch/messages", async (chatId) => {
  try {
    const messages = await chatApi.get(`/${chatId}`);
    return messages.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//send message
const sendMessage = createAsyncThunk("send/message", async (data) => {
  try {
    const messages = await chatApi.post("/message/send", data);
    return messages.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

export {
  searchForUser,
  createChat,
  createGroupChat,
  fetchChats,
  fetchMessages,
  sendMessage,
  renameGroupChat,
  addUserToGroupChat,
  removeUserFromGroupChat,
  deleteGroup,
};
