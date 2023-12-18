import crypto from "crypto";

export const chatConfig = (socket) => {
  console.log("socket connection established...");

  const { userId } = socket.handshake.auth;

  socket.join(userId);
  console.log("user joined" + userId);

  //sending and recieving messages
  socket.on("new-msg", (msg) => {
    //creating new chat object with additional keys
    const newMsg = {
      ...msg,
      _id: crypto.randomBytes(12).toString("hex"),
      createdAt: Date.now(),
    };

    if(!newMsg.users) return 

    newMsg.users.forEach((user) => {
      if (user._id === newMsg.sender.userId) return;

      socket.to(user._id).emit("rec-msg", newMsg);
    });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected...");
  });
};
