import { useSelector } from "react-redux";
import { fetchMessages, sendMessage } from "../../store";
import { useThunk } from "../../hooks/useThunk";
import { useEffect, useState } from "react";
import { Chip, CircularProgress, LinearProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment";

function ChatBox({ activeChat, getChatNane, user }) {
  const [message, setMessage] = useState("");
  const { activeChatMessages } = useSelector((state) => state.chat);

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
    const data = { chatId: activeChat._id, content: message };
    doSendMessage(data);
    setMessage("");
  };

  console.log("messages", activeChatMessages);

  //mapping over messages array
  const messages = activeChatMessages.map((msg) => {
    return (
      <div className="m-1" style={{ minWidth: "3rem", minHeight: "2rem" }}>
        <Chip
          key={msg._id}
          label={
            <div
              className="position-relative"
              style={{ minWidth: "3rem", maxWidth: "40rem", minHeight: "2rem" }}
            >
              <span>{msg.message}</span>
              <p
                className="position-absolute end-0 mx-2"
                style={{ fontSize: "0.6rem", color: "gray" }}
              >
                {moment(msg.createdAt).format("hh:mm:A")}
              </p>
            </div>
          }
          variant="filled"
          sx={{
            width: "fit-content",
            color: "white",
            bgcolor: "black",
            height: "auto",
            position: "absolute",
            right: msg.sender._id === user.userId && 0,
            left: msg.sender._id !== user.userId && 0,
            padding: "0.3rem",
          }}
        />
      </div>
    );
  });

  //fetching messages on chat change
  useEffect(() => {
    if (!activeChat._id) return;

    doFetchMessages(activeChat._id);
  }, [doFetchMessages, activeChat._id]);

  //if no chat is active show this message & return early
  if (!Object.keys(activeChat).length) {
    return (
      <div className="bg-dark p-2 rounded h-100 position-relative">
        <h3
          className="position-absolute top-50 start-50 translate-middle"
          style={{ color: "gray", opacity: "0.5" }}
        >
          No Chat Selected
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-dark p-2 rounded h-100">
      <h4 className="border-bottom pb-2">
        {activeChat.isGroupChat
          ? activeChat.chatName
          : getChatNane(user, activeChat?.users)}
      </h4>
      {loadingMessages ? (
        <LinearProgress sx={{ bgcolor: "#8a2be2" }} />
      ) : (
        <div
          className="d-flex flex-column position-relative"
          style={{ height: "95%" }}
        >
          <div className="position-relative overflow-auto scroll-none py-1 h-100 d-flex flex-column gap-2">
            {messages}
          </div>
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
              style={{ width: "8rem" }}
              disabled={sendingMessage}
            >
              Send{" "}
              {sendingMessage ? <CircularProgress size={12} /> : <SendIcon />}
            </button>
          </div>
        </div>
      )}

      {errorLoadingMessages && (
        <div className="text-danger">something went wrong</div>
      )}

      {errorSendingMessage && (
        <div className="text-danger">something went wrong</div>
      )}
    </div>
  );
}

export default ChatBox;
