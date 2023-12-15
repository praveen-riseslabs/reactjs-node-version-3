import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import { connectDb } from "./connectDb.js";
import userRoutes from "./routes/userRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"
import { chatModel } from "./models/chatModel.js";

//configuration
dotenv.config();
const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });

//middlewares
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

//route middlewares
app.use("/user", userRoutes);
app.use("/file", fileRoutes);
app.use("/chat", chatRoutes);
app.use("/*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// connecting to DB
connectDb(process.env.MONGO_URI, process.env.DB_NAME);

//socket io connection

const users = new Map();

//socket nameSpace connection
const chat = io.of("/chat");

chat.on("connection", async (socket) => {
  console.log("socket connection established...");

  //changing user online status : true
  // socket.handshake.auth.userId &&
  //   (await chatModel.findByIdAndUpdate(
  //     socket.handshake.auth.userId,
  //     { isOnline: true },
  //     { upsert: true }
  //   ));

  socket.on("disconnect", async () => {
    console.log("socket disconnected...");
    //changing user online status : false
    // await chatModel.findByIdAndUpdate(socket.handshake.auth.userId, {
    //   isOnline: false,
    // });
  });
});

//starting the server
server.listen(port, () => {
  console.log(`listening on port: ${port} - http://localhost:${port}`);
});
