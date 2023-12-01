import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";

class UserController {
  static async registerUser(req, res) {
    try {
      const { username, fullname, email, phoneNumber, gender, password } =
        req.body;

        if(!username || !fullname ||  !email || !phoneNumber || !gender || !password){
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
}

export { UserController };
