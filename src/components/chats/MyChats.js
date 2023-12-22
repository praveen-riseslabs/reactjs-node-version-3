import { Avatar, LinearProgress, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useThunk } from "../../hooks/useThunk";
import { fetchChats, setActiveChat } from "../../store";
import { useEffect } from "react";
import NewGroupChat from "../modals/NewGroupChat";

function MyChats({ selectedChat, getChatNane, isMobile }) {
  const { chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [doFetchChats, loadingChats, errorLoadingChats] = useThunk(fetchChats);
  //handle click on chat
  const handleChatClick = (chat) => {
    dispatch(setActiveChat(chat));
  };

  //get sender username of latest message
  const getSenderName = (senderId, users) => {
    if (!senderId) return;

    const { username } = users.find(
      (user) => user._id === senderId && user.username
    );
    return username;
  };

  //fetching all chats on component load
  useEffect(() => {
    doFetchChats();
  }, [doFetchChats]);

  if (!chats.length) {
    return <div className="fs-4 fw-bold">No Chats</div>;
  }

  return (
    <div className="bg-dark p-2 rounded h-100 overflow-auto scroll-none">
      <div className="border-bottom d-flex justify-content-between align-items-center">
        {isMobile ? <h6>MyChats</h6> : <h4>MyChats</h4>}
        <NewGroupChat isMobile={isMobile} />
      </div>
      {loadingChats ? (
        <LinearProgress sx={{ bgcolor: "#8a2be2" }} />
      ) : (
        <Stack spacing={isMobile ? 1 : 2} sx={{ marginBlock: "1rem" }}>
          {chats.map((chat) => {
            return (
              <div
                key={chat._id}
                className="border p-md-2 p-sm-1 rounded d-flex gap-2 align-items-center overflow-hidden"
                style={
                  selectedChat._id === chat._id
                    ? {
                        backgroundColor: "#8a2be2",
                        opacity: "0.5",
                        border: "1px solid #009dff",
                      }
                    : {}
                }
                role="button"
                onClick={() => handleChatClick(chat)}
              >
                {!isMobile && <Avatar sx={{ padding: 0, margin: 0 }} />}
                <div className="d-flex flex-column">
                  <span className="fw-bold">
                    {chat.isGroupChat
                      ? chat.chatName
                      : getChatNane(user, chat.users)}
                  </span>
                  <span
                    className="d-flex gap-2"
                    style={{ height: "1.8rem", overflow: "hidden" }}
                  >
                    <p className="fw-bold" style={{ color: "#009dff" }}>
                      {getSenderName(chat.latestMessage?.sender, chat.users)} -
                    </p>
                    <p>{chat.latestMessage?.message}</p>
                  </span>
                </div>
              </div>
            );
          })}
        </Stack>
      )}
      {errorLoadingChats && (
        <div className="text-danger">something went wrong</div>
      )}
    </div>
  );
}

export default MyChats;
