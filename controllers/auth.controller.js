import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";

const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
      return res.status(401).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(401).json({ error: "User already exist." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser?._id, res);
      await newUser.save();

      res.status(201).json(newUser);
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
<<<<<<< HEAD
    console.log("Error in register", error);
=======
    console.log("Erro in register", error);
    
>>>>>>> bbd6c2010b00182f7a742e64d42b3f26e0163aa6
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password) {
      return res.status(401).json({ error: "Both are required" });
    }

    if (!email) {
      return res.status(401).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Incorrect email or password" });
    }
    const isPassCorrect = await bcrypt.compare(password, user?.password || "");
    if (!isPassCorrect || !user) {
      return res.status(400).json({ error: "Incorrect email or password" });
    }

    generateTokenAndSetCookie(user?._id, res);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(201).json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "New password are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized, invalid token" });
    }
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(newPassword.trim(), salt);
    user.password = hashPass;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const changePassword = asyncHandler(async (req, res) => {
  try {
    const { oldPass, newPass  } = req.body;
    const userId = req.user?._id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!oldPass || !newPass ) {
      return res.status(400).json({ error: "Both are required" });
    }

    // Change password
    if (oldPass && newPass) {
      if (oldPass.trim() === newPass.trim()) {
        return res.status(401).json({
          error: "You entered old password. Please try a new password",
        });
      }

      const isPassCorrect = await bcrypt.compare(oldPass.trim(), user.password);
      if (!isPassCorrect) {
        return res.status(401).json({ error: "Incorrect current password" });
      }

      if (newPass.length < 6) {
        return res
          .status(401)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(newPass.trim(), salt);
      user.password = hashPass || user.password;
      user = await user.save();
      res.status(200).json(user);
    }
  } catch (error) {
    console.log("error in change pass", error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const changeEmail = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user?._id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email are required" });
    }

    // Change email
    user.email = email || user.email;
    user = await user.save();
    res.status(200).json(user);
   
  } catch (error) {
    console.log("error in change pass", error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getMe = asyncHandler(async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { register, login, logout, getMe, resetPassword, changePassword,changeEmail };
