import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

async function requireAuth(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer")) {
      throw new Error("Not authorized");
    }

    const token = authorization.split(" ")[1];

    const {id} = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await userModel.findById(id, { password: 0 });
    
    next();
  } catch (err) {
    res.status(403).json({ error: "Not authorized" });
  }
}

export { requireAuth };
