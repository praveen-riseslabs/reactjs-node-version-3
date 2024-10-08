import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import { connectDb } from "./connectDb.js";
import userRoutes from "./routes/userRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import mapRoutes from "./routes/mapRoutes.js";
import { chatConfig } from "./socketRoutes/chatConfig.js";

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
app.use("/asset", assetRoutes);
app.use("/map", mapRoutes);
app.use("/*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// connecting to DB
connectDb(process.env.MONGO_URI, process.env.DB_NAME);

//socket io connection
//socket nameSpace connection for chats
const chat = io.of("/chat");
chat.on("connection", chatConfig);

//starting the server
server.listen(port, () => {
  console.log(`listening on port: ${port} - http://localhost:${port}`);
});
