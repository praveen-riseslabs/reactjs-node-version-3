import { Avatar, LinearProgress, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { useThunk } from "../../hooks/useThunk";
import { fetchChats } from "../../store";
import { useEffect } from "react";

function MyChats({ onSelect, selectedChatId, getChatNane }) {
  const { chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);

  const [doFetchChats, loadingChats, errorLoadingChats] = useThunk(fetchChats);
  
  //handle click on chat
  const handleChatClick = (chat) => {
    onSelect(chat);
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
      <h4 className="border-bottom pb-2">MyChats</h4>
      {loadingChats ? (
        <LinearProgress sx={{ bgcolor: "#8a2be2" }} />
      ) : (
        <Stack spacing={2} sx={{ marginBlock: "1rem" }}>
          {chats.map((chat) => {
            return (
              <div
                key={chat._id}
                className="border p-2 rounded d-flex gap-2 align-items-center overflow-hidden"
                style={
                  selectedChatId === chat._id
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
                <Avatar sx={{ padding: 0, margin: 0 }} />
                <div className="d-flex flex-column">
                  <span className="fw-bold">
                    {chat.isGroupChat
                      ? chat.chatName
                      : getChatNane(user, chat.users)}
                  </span>
                  <span className="d-flex" style={{ height: "1.5rem" }}>
                    <p className="fw-bold" style={{ color: "#009dff" }}>
                      sender:
                    </p>
                    <p>{chat.latestMessage.message}</p>
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
