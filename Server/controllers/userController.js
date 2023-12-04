import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";

class UserController {
  //user registration post controller
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

      const emailExist = await userModel.findOne({ email });

      if (emailExist) {
        throw new Error("Email already in use");
      }

      const usernameExist = await userModel.findOne({ username });

      if (usernameExist) {
        throw new Error("username already taken");
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT_VALUE));
      const hash = await bcrypt.hash(password, salt);

      const newUser = new userModel({
        username,
        fullname,
        phoneNumber,
        email,
        gender,
        password: hash,
      });

      await newUser.save();

      res.status(201).json({ username, fullname, email, phoneNumber, gender });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //login user
  static async loginUser(req, res) {
    try {
      const { usernameOrEmail, password } = req.body;

      if (!usernameOrEmail || !password) {
        throw new Error("Fields must not be empty");
      }

      const user = await userModel.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });

      if (!user) {
        throw new Error("User not found");
      }

      const pass = await bcrypt.compare(password, user.password);

      if (!pass) {
        throw new Error("User not found");
      }

      res
        .status(200)
        .json({
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
        });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //getting user details
  static async getUserDetails(req, res) {
    try {
      const { email } = req.params;

      const user = await userModel.findOne({email});

      res
        .status(200)
        .json({
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
        });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { UserController };
