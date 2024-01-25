import { pool } from "../db/connectDb.js";
import bcrypt from "bcrypt";
import { createJwtToken } from "../utils/createJwtToken.js";

class UserController {
  //user registeration..............................................................................
  static async registerUser(req, res) {
    try {
      const { username, fullname, email, phoneNumber, gender, password } =
        req.body;

        console.log(username, fullname, email, phoneNumber, gender, password);

      if (
        !username ||
        !fullname ||
        !email ||
        !phoneNumber ||
        !gender ||
        !password
      ) {
        throw new Error("Fields must not be empty");
      }

      const emailExist = await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      );

      if (emailExist.rows.length) {
        throw new Error("Email already in use");
      }

      const usernameExist = await pool.query(
        "SELECT username FROM users WHERE username = $1",
        [username]
      );

      if (usernameExist.rows.length) {
        throw new Error("username already taken");
      }
      //encrypting password
      const salt = await bcrypt.genSalt(Number(process.env.SALT_VALUE));
      const hash = await bcrypt.hash(password, salt);

      const {
        rows: [user],
      } = await pool.query(
        "INSERT INTO users (id, username, fullname, email, phone_number, gender, password) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6) RETURNING *",
        [username, fullname, email, phoneNumber, gender, hash]
      );

      res.status(201).json({
        username,
        fullname,
        email,
        phoneNumber,
        gender,
        userId: user.id,
        token: createJwtToken(user.id),
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //login user...................................................................................
  static async loginUser(req, res) {
    try {
      const { usernameOrEmail, password } = req.body;

      if (!usernameOrEmail || !password) {
        throw new Error("Fields must not be empty");
      }

      const {
        rows: [user],
      } = await pool.query(
        "SELECT * FROM users WHERE username = $1 OR email = $1",
        [usernameOrEmail]
      );

      if (!user) {
        throw new Error("User not found");
      }

      const pass = await bcrypt.compare(password, user.password);

      if (!pass) {
        throw new Error("User not found");
      }

      res.status(200).json({
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phone_number,
        gender: user.gender,
        userId: user.id,
        token: createJwtToken(user.id),
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //getting user details.........................................................................
  static async getUserDetails(req, res) {
    try {
      const user = req.user;
      res.status(200).json({
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phone_number,
        gender: user.gender,
        userId: user.id,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { UserController };
