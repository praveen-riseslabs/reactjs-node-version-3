import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { ChatController } from "../controllers/chatController.js";
import { MessageController } from "../controllers/messageController.js";

const router = express.Router();
router.use(requireAuth);

//chats routes...................................................................................
//creating new single chat
router.post("/create/single", ChatController.createOnetoOneChat);

//creating group chat
router.post("/create/group", ChatController.createGroupChat);

//delete group
router.delete("/delete/group", ChatController.deleteGroup);

//renaming group chat
router.put("/group/rename", ChatController.renameChatGroup);

//add user to group
router.put("/group/add", ChatController.addUserToGroup);

//remove user from group
router.put("/group/remove", ChatController.removeUserFromGroup);


//loading all chats
router.get("/", ChatController.fetchChats);

//messages routes.....................................................................................
//loading chat contents
router.get("/:chatId", MessageController.loadChatContents);

//send message
router.post("/message/send", MessageController.sendMessage);

export default router;
