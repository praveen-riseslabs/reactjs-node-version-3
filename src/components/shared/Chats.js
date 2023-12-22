import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import MyChats from "../chats/MyChats";
import ChatBox from "../chats/ChatBox";
import SideDrawer from "../chats/SideDrawer";
import { useOutletContext } from "react-router-dom";

const baseUrl = process.env.REACT_APP_SERVER_BASE_API;

function Chats() {
  const { user } = useSelector((state) => state.user);
  const { activeChat } = useSelector((state) => state.chat);

  const isMobile = useOutletContext()

  //setting up chat socket
  const chatSocket = useMemo(
    () =>
      io(`${baseUrl}/chat`, {
        auth: {
          userId: user.userId,
        },
      }),
    [user.userId]
  );

  //get chats username
  const getChatNane = (loggedInUser, users) => {
    if (!users) return;

    return loggedInUser.userId === users[0]._id
      ? users[1].username
      : users[0].username;
  };

  //chat socket first connection
  useEffect(() => {
    chatSocket.on("connect", () => {
      console.log("Chat socket connected!...");
    });

    return () => {
      chatSocket.on("disconnect", () => {
        console.log("Chat socket disconnected!...");
      });
    };
  }, [chatSocket]);

  return (
    <div className="container-fluid" style={{ height: "45rem" }}>
      <div className="row">
        <SideDrawer />
      </div>
      <div className="row py-2" style={{ height: "43rem" }}>
        <div className="col-4 h-100 p-1 p-md-2">
          <MyChats selectedChat={activeChat} getChatNane={getChatNane} isMobile={isMobile} />
        </div>
        <div className="col-8 h-100 p-1 p-md-2">
          <ChatBox
            activeChat={activeChat && activeChat}
            user={user}
            getChatNane={getChatNane}
            chatSocket={chatSocket}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
}

export default Chats;
