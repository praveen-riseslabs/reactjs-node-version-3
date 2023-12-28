import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { mailTransporter, sendMail } from "../utils/mailTransporter.js";
import { mailConfig } from "../utils/credentials.js";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { createJwtToken } from "../utils/createJwtToken.js";

class UserController {
  //user registration...........................................................................
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

      //encrypting password
      const salt = await bcrypt.genSalt(Number(process.env.SALT_VALUE));
      const hash = await bcrypt.hash(password, salt);

      //email tokens
      const token = crypto.randomBytes(16).toString("hex");

      const newUser = new userModel({
        username,
        fullname,
        phoneNumber,
        email,
        gender,
        password: hash,
        emailToken: token,
      });

      await newUser.save();

      //mail options (what to whom)
      const mailOptions = {
        from: {
          name: "RisesLabs",
          address: mailConfig.email,
        },
        to: email, // list of receivers
        subject: "verify your email", // Subject line
        html: `
        <div style="width:100%;">
        <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 2rem;
        "
      >
        <h3>Please click on the below link to verify your email</h3>
        <div>
        <a href="${process.env.CLIENT_URL}/verify/${token}" target="_blank" rel="noreferrer">
          <button
            style="
              padding-inline: 1rem;
              padding-block: 0.3rem;
              font-weight: 600;
              border-radius: 0.5rem;
              color: white;
              font-size: 1.1rem;
              background: linear-gradient(to right, #009dff, #8a2be2);
            "
          >
            Verify
          </button>
        </a>
        </div>
      </div>
      </div>
        `, // html body
      };
      //sending mail
      sendMail(mailTransporter, mailOptions);

      res.status(201).json({
        username,
        fullname,
        email,
        phoneNumber,
        gender,
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

      res.status(200).json({
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        userId: user._id,
        isTrackingEnabled: user.isTrackingEnabled,
        token: createJwtToken(user._id),
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //getting user details.........................................................................
  static async getUserDetails(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw new Error("User not found");
      }

      const user = await userModel.findById(userId);

      res.status(200).json({
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        userId: user._id,
        isTrackingEnabled: user.isTrackingEnabled,
        isVerified: user.isVerified,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //verify email address...........................................................................
  static async verifyEmail(req, res) {
    try {
      const { emailToken } = req.body;

      if (!emailToken) {
        throw new Error("Please re-send a verification link through website");
      }

      const user = await userModel.findOne({ emailToken });

      if (!user) {
        throw new Error("User is already verified");
      }

      await userModel.findByIdAndUpdate(user._id, {
        $set: { isVerified: true, emailToken: null },
      });

      res.status(200).json({
        status: 200,
        msg: "success",
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //reseting user password......................................................................
  static async resetPassword(req, res) {
    try {
      const { userId, newPassword } = req.body;

      if (!newPassword) {
        throw new Error("Enter new password");
      }

      //encrypting password
      const salt = await bcrypt.genSalt(Number(process.env.SALT_VALUE));
      const hash = await bcrypt.hash(newPassword, salt);

      await userModel.findByIdAndUpdate(userId, {
        $set: { password: hash },
      });

      res.status(200).json({
        status: 200,
        msg: "success",
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //sending password reset link...................................................................
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        throw new Error("Enter your email address");
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        throw new Error("Please enter a valid email address");
      }

      //mail options (what to whom)
      const mailOptions = {
        from: {
          name: "RisesLabs",
          address: mailConfig.email,
        },
        to: email, // list of receivers
        subject: "reset password link", // Subject line
        html: `
        <div style="width:100%;">
        <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 2rem;
        "
      >
        <h3>Please click on the below link to reset your password</h3>
        <div>
        <a href="${process.env.CLIENT_URL}/resetpassword/${user._id}" target="_blank" rel="noreferrer">
          <button
            style="
              padding-inline: 1rem;
              padding-block: 0.3rem;
              font-weight: 600;
              border-radius: 0.5rem;
              color: white;
              font-size: 1.1rem;
              background: linear-gradient(to right, #009dff, #8a2be2);
            "
          >
            Reset Link
          </button>
        </a>
        </div>
      </div>
      </div>
          `, // html body
      };

      sendMail(mailTransporter, mailOptions);

      res.status(200).json({
        status: 200,
        msg: "success",
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //google login.................................................................................
  static async googleLogin(req, res) {
    try {
      const { token, clientId } = req.body;

      //verifying the client
      const client = new OAuth2Client(clientId);

      // Call the verifyIdToken to varify and decode it
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
      });
      // extracting the user details
      const payload = ticket.getPayload();

      const { name, given_name, family_name, email, email_verified, sub } =
        payload;

      const user = await userModel.findOne({ email });

      const fullname = `${given_name} ${family_name}`;

      if (!user) {
        //creating new user
        const newUser = new userModel({
          username: name,
          fullname,
          phoneNumber: "not given",
          email,
          password: "G",
          isVerified: email_verified,
          googleId: sub,
        });
        await newUser.save();
      }

      if (!user.googleId) {
        await userModel.findByIdAndUpdate(user._id, { googleId: sub });
      }

      res.status(200).json({
        username: name,
        fullname,
        email: email,
        userId: user._id,
        isTrackingEnabled: user.isTrackingEnabled,
        token: createJwtToken(user._id),
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //facebook login.................................................................................
  static async facebookLogin(req, res) {
    try {
      const { email, username, fullname, facebookId } = req.body;

      const user = await userModel.findOne({ email });

      if (!user) {
        //creating new user
        const newUser = new userModel({
          username,
          fullname,
          phoneNumber: "not given",
          email,
          password: "F",
          facebookId,
        });
        await newUser.save();
      }

      if (!user.facebookId) {
        await userModel.findByIdAndUpdate(user._id, { facebookId });
      }

      res.status(200).json({
        username,
        fullname,
        email,
        userId: user._id,
        isTrackingEnabled: user.isTrackingEnabled,
        token: createJwtToken(user._id),
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //Edit user info....................................................................................
  static async editUserInfo(req, res) {
    try {
      const { password, username, fullname, gender, phoneNumber, userId } =
        req.body;

      const user = await userModel.findById(userId);

      if (!user) {
        throw new Error("Invalid user");
      }

      const verifyPass = await bcrypt.compare(password, user.password);

      if (!verifyPass) {
        throw new Error("something's wrong");
      }

      await userModel.findByIdAndUpdate(userId, {
        fullname,
        gender,
        username,
        phoneNumber,
      });

      res.status(200).json({ status: "success" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //load user friends...................................................................................
  static async searchForUsers(req, res) {
    try {
      const { search } = req.query;
      if (!search) {
        throw new Error("search query is missing");
      }

      const users = await userModel
        .find(
          {
            $or: [
              { fullname: { $regex: search, $options: "i" } },
              { username: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          },
          { password: 0, facebookId: 0, googleId: 0, emailToken: 0 }
        )
        .find({ _id: { $ne: req.user._id } });

      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //toggle tracking...................................................................................
  static async toggleTracking(req, res) {
    try {
      const { tracking = false } = req.query;
      
      const user = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          $set: { isTrackingEnabled: tracking },
        },
        { new: true }
      );

      res
        .status(200)
        .json({
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
          userId: user._id,
          isTrackingEnabled: user.isTrackingEnabled,
        });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { UserController };
