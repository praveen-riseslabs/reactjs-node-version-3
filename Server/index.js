import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./connectDb.js";
import userRoutes from "./routes/userRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

//configuration
dotenv.config();
const app = express();
const port = process.env.PORT;

//middlewares
app.use(cors({ origin: process.env.CLIENT_URL}));
app.use(express.json());

//route middlewares
app.use("/user", userRoutes);
app.use("/file", fileRoutes);

// connecting to DB
connectDb(process.env.MONGO_URI, process.env.DB_NAME);

//starting the server
app.listen(port, () => {
  console.log(`listening on port: ${port} - http://localhost:${port}`);
});
