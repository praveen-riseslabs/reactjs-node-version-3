import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  changeChatLatestMessage,
  fetchMessages,
  notify,
  sendMessage,
} from "../../store";
import { useThunk } from "../../hooks/useThunk";
import { useEffect, useState } from "react";
import { CircularProgress, LinearProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment";
import GroupChatEdit from "../modals/GroupChatEdit";

function ChatBox({ activeChat, getChatNane, user, chatSocket, isMobile }) {
  const [message, setMessage] = useState("");
  const { activeChatMessages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const [doFetchMessages, loadingMessages, errorLoadingMessages] =
    useThunk(fetchMessages);
  const [doSendMessage, sendingMessage, errorSendingMessage] =
    useThunk(sendMessage);

  //handle input change
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  //handle message send
  const handleSend = () => {
    if (!message) return;

    const data = { chatId: activeChat._id, content: message };
    doSendMessage(data);
    setMessage("");

    // configuration for sending message through socket
    const msg = {
      chatName: activeChat.chatName,
      chatId: activeChat._id,
      sender: user,
      message,
      users: activeChat.users,
    };

    chatSocket.emit("new-msg", msg);

    dispatch(changeChatLatestMessage(msg));
  };

  //recieve message
  useEffect(() => {
    chatSocket.on("rec-msg", (msg) => {
      if (!activeChat._id) return;

      const updatedLatestMsg = {
        chatId: msg.chatId,
        sender: msg.sender,
        message: msg.message,
      };
      dispatch(changeChatLatestMessage(updatedLatestMsg));

      if (msg.chatId !== activeChat._id) {
        // console.log("notify",msg.chatId, activeChat._id);
        dispatch(notify(msg));
      } else {
        // console.log("active chat",msg.chatId, activeChat._id);
        dispatch(addMessage(msg));
      }
    });
  }, [chatSocket, dispatch, activeChat._id]);

  //fetching messages on chat change
  useEffect(() => {
    if (!activeChat._id) return;

    doFetchMessages(activeChat._id);
  }, [doFetchMessages, activeChat._id]);

  //mapping over messages array
  const messages = activeChatMessages.map((msg) => {
    return (
      <div
        key={msg._id}
        className={`d-flex ${
          msg.sender._id !== user.userId
            ? "justify-content-start"
            : "justify-content-end"
        }`}
      >
        <div
          className="overflow-hidden p-1 rounded d-flex flex-column"
          style={{
            minWidth: "5rem",
            maxWidth: "40rem",
            boxShadow: "0 0.5px 1px 0 gray",
          }}
        >
          {msg.sender._id !== user.userId && (
            <span style={{ fontSize: "0.6rem", color: "#009dff" }}>
              {msg.sender.username}
            </span>
          )}
          <span
            className="overflow-hidden text-break"
            style={{ fontSize: "0.9rem" }}
          >
            {msg.message}
          </span>
          <span style={{ fontSize: "0.6rem", alignSelf: "end", color: "gray" }}>
            {moment(msg.createdAt).format("hh:mm A")}
          </span>
        </div>
      </div>
    );
  });

  //if no chat is active show this message & return early
  if (!Object.keys(activeChat).length) {
    return (
      <div className="bg-dark p-2 rounded h-100 position-relative">
        <h3
          className="position-absolute top-50 start-50 translate-middle"
          style={{ color: "gray", opacity: "0.5", fontSize:isMobile && "1rem" }}
        >
          No Chat Selected
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-dark p-2 rounded h-100">
      <div className="border-bottom pb-2 d-flex justify-content-between">
        <h4>
          {activeChat.isGroupChat
            ? activeChat.chatName
            : getChatNane(user, activeChat?.users)}
        </h4>
        {activeChat.isGroupChat && <GroupChatEdit activeChat={activeChat} isMobile={isMobile} />}
      </div>
      {loadingMessages ? (
        <LinearProgress sx={{ bgcolor: "#8a2be2" }} />
      ) : (
        <div
          className="d-flex flex-column position-relative"
          style={{ height: "95%" }}
        >
          <div className="position-relative overflow-auto scroll-none mb-2 h-100 d-flex flex-column gap-2">
            {messages}
          </div>

          {/* error handling */}
          {errorLoadingMessages ||
            (errorSendingMessage && (
              <div className="text-danger">something went wrong</div>
            ))}

          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message"
              value={message}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleSend}
              style={{ width: !isMobile && "8rem" }}
              disabled={sendingMessage}
            >
              {!isMobile && "Send "}
              {sendingMessage ? <CircularProgress size={12} /> : <SendIcon />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
