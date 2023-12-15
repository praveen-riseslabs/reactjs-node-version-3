import { chatModel } from "../models/chatModel.js";
import { messageModel } from "../models/messageModel.js";

class MessageController {
  //loading chat messages/convos...................................................................
  static async loadChatContents(req, res) {
    try {
      const { chatId } = req.params;

      const messages = await messageModel
        .find({ chatId })
        .populate("sender", "-password -googleId -facebookId -emailToken");

      res.status(200).json(messages);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //sending messages...................................................................
  static async sendMessage(req, res) {
    try {
      const { chatId, content } = req.body;
      
      if (!chatId || !content) {
        throw new Error("chatId or content cannot be empty");
      }

      const newMessage = new messageModel({
        sender: req.user._id,
        chatId,
        message: content,
      });

      await newMessage.save();

      const finalMessage = await messageModel
        .findById(newMessage._id)
        .populate("sender", "-password -googleId -facebookId -emailToken");

      await chatModel.findByIdAndUpdate(newMessage.chatId, {
        latestMessage: finalMessage,
      });

      res.status(200).json(finalMessage);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { MessageController };
