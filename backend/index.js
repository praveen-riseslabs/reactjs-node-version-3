import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

//setup
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

//middlewares
app.use(cors());
app.use(express.json());

//route middlewares
app.use("/api/v1/user", userRoutes);
app.use("/health", (req, res) => {
  res
    .status(200)
    .json({ message: `server running at http://localhost:${port}` });
});
app.use("/*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(port, () => {
  console.log("server listening at http://localhost:" + port);
});
