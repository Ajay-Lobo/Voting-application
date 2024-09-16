import logger from "../utils/logger.js";
import { User } from "../models/index.js";
import { generateToken } from "../middlewares/jwt.js";
// import bcrypt from "bcrypt";

const signup = async (req, res) => {
  const { name, email, age, mobile, address, aadhar, role, password } =
    req.body;

  try {
    if (role === "admin") {
      logger.info(`Admin signup attempt by: ${name}`);
      const adminExists = await User.findOne({ role: "admin" });
      if (adminExists) {
        logger.warn(
          `Admin creation failed: Admin already exists - ${adminExists.name}`
        );
        return res.status(400).json({
          success: false,
          message: "Admin already exists. Only one admin is allowed.",
        });
      }
    }

    const user = new User({
      name,
      email,
      age,
      mobile,
      address,
      aadhar,
      role,
      password,
    });

    const savedUser = await user.save();

    const payload = {
      id: savedUser.id,
    };

    logger.info(`New user registered: ${name}`);
    const token = generateToken(payload);

    res.status(201).json({
      success: true,
      message: "Person successfully created.",
      data: savedUser,
      token: token,
    });
  } catch (err) {
    // Log error
    logger.error(`Signup error: ${err.message}`);

    res.status(400).json({
      success: false,
      message: "Validation failed or other error occurred.",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  const { aadhar } = req.body;
  const user = req.user;
  logger.info(`Login successful for username: ${aadhar}`);

  try {
    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);

    res.json({
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(401).json({
      error: "Unauthorized",
    });
  }
};

const getAllPersons = async (req, res) => {
  try {
    const users = await User.find();
    logger.info(`Fetched ${users.length} users`);
    res.json(users);
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

const showProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching user: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { oldPassword, newPassword } = req.body;
  try {
    if (user.password === oldPassword) {
      user.password = newPassword;
      await user.save();
      logger.info(`Password changed for user: ${user.aadhar}`);
      res.json({ message: "Password changed successfully" });
    } else {
      logger.warn(`Incorrect old password for user: ${user.aadhar}`);
      res.status(400).json({ message: "Incorrect old password" });
    }
  } catch (err) {
    logger.error(`Error changing password: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

export { signup, login, getAllPersons, showProfile, changePassword };
