import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel";

async function requireAuth(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("Not authorized");
    }

    const token = authorization.split(" ")[1];

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await userModel.findById(userId, { password: 0 });

    next();
  } catch (err) {
    res.status(403).json({ error: "Not authorized" });
  }
}

export { requireAuth };
