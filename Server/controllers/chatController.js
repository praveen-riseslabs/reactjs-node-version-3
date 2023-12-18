import { chatModel } from "../models/chatModel.js";

class ChatController {
  //accessing or creating new one-to-one chat.....................................................
  static async createOnetoOneChat(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        throw new Error("userId is param not sent with the request");
      }

      //checking if your userId and other user id match
      if (userId === req.user._id.toString()) {
        throw new Error("you cannot send message to yourself");
      }

      const isChat = await chatModel
        .findOne({
          isGroupChat: false,
          users: { $all: [userId, req.user._id] },
        })
        .populate("users", "-password -googleId -facebookId -emailToken")
        .populate("latestMessage");

      if (isChat !== null && isChat !== undefined) {
        // Chat document exists
        res.status(200).json(isChat);
      } else {
        // Create a new chat document
        const newChat = new chatModel({
          isGroupChat: false,
          users: [req.user._id, userId],
        });

        await newChat.save();

        const chat = await chatModel
          .findById(newChat._id)
          .populate("users", "-password -googleId -facebookId -emailToken")
          .populate("latestMessage");

        res.status(201).json(chat);
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //accessing or creating new group chat.....................................................
  static async createGroupChat(req, res) {
    try {
      const { name, users } = req.body;

      if (!name) {
        throw new Error("Group name cannot be empty");
      }

      if (users.length < 2) {
        throw new Error("More than 2 users are requires to form a group chat");
      }

      users.push(req.user);

      const groupChat = new chatModel({
        chatName: name,
        users,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      await groupChat.save();

      const fullGroupChat = await chatModel
        .findById(groupChat._id)
        .populate("users", "-password -googleId -facebookId -emailToken")
        .populate("groupAdmin", "-password -googleId -facebookId -emailToken");

      res.status(201).json(fullGroupChat);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //renaming group name.........................................................................
  static async renameChatGroup(req, res) {
    try {
      const { name, chatId } = req.body;

      if (!name) {
        throw new Error("Group name cannot be empty");
      }

      const groupChat = await chatModel.findById(chatId);

      if (groupChat.groupAdmin.toString() !== req.user._id.toString()) {
        throw new Error("you're not a group admin");
      }

      const updatedGroupChat = await chatModel.findByIdAndUpdate(
        chatId,
        { chatName: name },
        { new: true }
      );

      res.status(200).json(updatedGroupChat);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //add user to group.........................................................................
  static async addUserToGroup(req, res) {
    try {
      const { chatId, userId } = req.body;

      const updatedGroup = await chatModel
        .findByIdAndUpdate(
          chatId,
          {
            $push: { users: userId },
          },
          { new: true }
        )
        .populate("users", "-password -googleId -facebookId -emailToken")
        .populate("groupAdmin", "-password -googleId -facebookId -emailToken");

      res.status(200).json(updatedGroup);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //remove user from group.........................................................................
  static async removeUserFromGroup(req, res) {
    try {
      const { chatId, userId } = req.body;

      const updatedGroup = await chatModel
        .findByIdAndUpdate(
          chatId,
          {
            $pull: { users: userId },
          },
          { new: true }
        )
        .populate("users", "-password -googleId -facebookId -emailToken")
        .populate("groupAdmin", "-password -googleId -facebookId -emailToken");

      res.status(200).json(updatedGroup);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //delete group.........................................................................
  static async deleteGroup(req, res) {
    try {
      const { chatId, adminId } = req.body;
      console.log(chatId, adminId, req.user._id);

      if (adminId !== req.user._id.toString()) {
        throw new Error("you're not an admin of this group");
      }

      const deletedGroup = await chatModel.findByIdAndDelete(chatId);

      res.status(200).json(deletedGroup);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //loading all chats/user chats.......................................................................
  static async fetchChats(req, res) {
    try {
      const chats = await chatModel
        .find({
          users: { $elemMatch: { $eq: req.user._id } },
        })
        .populate("users", "-password -googleId -facebookId -emailToken")
        .populate("groupAdmin", "-password -googleId -facebookId -emailToken")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      res.status(200).json(chats);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { ChatController };
