import jwt from "jsonwebtoken";
import { pool } from "../db/connectDb.js";

async function requireAuth(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer")) {
      throw new Error("Not authorized");
    }

    const token = authorization.split(" ")[1];

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const {
      rows: [user],
    } = await pool.query(
      "SELECT id, fullname, username, email, phone_number, gender FROM users WHERE id = $1",
      [id]
    );

    if (!user) {
      throw new Error("Not authorized");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: err.message || "Not authorized" });
  }
}

export { requireAuth };
