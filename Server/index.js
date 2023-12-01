import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./connectDb.js";
import userRoutes from "./routes/userRoutes.js";

//configuration
const app = express();
dotenv.config();
const port = process.env.PORT;

//middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/user", userRoutes);

// connecting to DB
connectDb(process.env.MONGO_URI, process.env.DB_NAME);

//starting the server
app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
