import { pool } from "../db/connectDb.js";
import bcrypt from "bcrypt";
import { createJwtToken } from "../utils/createJwtToken.js";

class UserController {
  //user registeration..............................................................................
  static async registerUser(req, res) {
    try {
      const { username, fullname, email, phoneNumber, gender, password } =
        req.body;

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

  //password resey OPT..................................................................................
  static async sendOTP(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        throw new Error("email is required to send an OTP");
      }

      const {
        rows: [user],
      } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

      if (!user) {
        throw new Error("Invalid email");
      }

      //generate random nums between 0 and 9 (inclusive)
      const generateOpt = (num) => {
        const opt = Array.from({ length: num }, () => 0);

        opt.forEach(
          (_, i) => (opt[i] = Math.round(Math.floor(Math.random() * 10)))
        );

        return opt.join("").toString();
      };

      const generatedOtp = generateOpt(6);
      console.log(generatedOtp);
      //send mail to specified email address

      const salt = await bcrypt.genSalt(4);
      const hashedOtp = await bcrypt.hash(generatedOtp, salt);

      await pool.query("DELETE FROM otps WHERE user_id = $1", [user.id]);

      const {
        rows: [otp],
      } = await pool.query(
        "INSERT INTO otps (id, otp, user_id, created_at) VALUES (uuid_generate_v4(), $1, $2, NOW()) RETURNING *",
        [hashedOtp, user.id]
      );

      res.status(200).json({ id: otp.id, user_id: otp.user_id });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //verifying entered opt.........................................................................
  static async verifyOTP(req, res) {
    try {
      const { otp, userId, id } = req.body;

      if (!otp) {
        throw new Error("opt is required to verify it is you");
      }

      const {
        rows: [user],
      } = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

      if (!user) {
        throw new Error("Invalid request");
      }

      const {
        rows: [obj],
      } = await pool.query("SELECT * FROM otps WHERE id = $1", [id]);

      if (!obj) {
        throw new Error("please re-send the request using valid email address");
      }

      //check if otp is expired
      const time = new Date(obj.created_at);
      time.setMinutes(time.getMinutes() + 10);

      if (time < Date.now()) {
        throw new Error("otp is expired, please re-send the otp request");
      }

      const decryptedOtp = await bcrypt.compare(otp, obj.otp);

      if (!decryptedOtp) {
        throw new Error("wrong opt");
      }

      res.status(200).json({ id: obj.id, user_id: user.id });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //reset password.........................................................................
  static async resetPassword(req, res) {
    try {
      const { password, confirmPassword, userId, id } = req.body;

      if (!id || !userId || !password || !confirmPassword) {
        throw new Error("fields cannot be empty");
      }

      if (confirmPassword !== password) {
        throw new Error("confirm password must match password");
      }

      const {
        rows: [otp],
      } = await pool.query("SELECT * FROM otps WHERE id = $1", [id]);

      if (!otp) {
        throw new Error("something went wrong, please try again");
      }

      await pool.query("DELETE FROM otps WHERE id = $1", [id]);

      const {
        rows: [user],
      } = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

      if (!user) {
        throw new Error("Invalid request");
      }

      //encrypting password
      const salt = await bcrypt.genSalt(Number(process.env.SALT_VALUE));
      const hash = await bcrypt.hash(password, salt);

      await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
        hash,
        userId,
      ]);

      res.status(200).json({ message: "success" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { UserController };
