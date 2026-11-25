import logger from "../utils/logger.js";
import { User } from "../models/index.js";
import { generateToken } from "../middlewares/jwt.js";
import bcrypt from "bcrypt";

const signup = async (req, res) => {
  const { name, email, age, mobile, address, aadhar, role, password, adminKey } = req.body;

  try {
    if (typeof aadhar !== "string" && typeof aadhar !== "number") {
      return res.status(400).json({ success: false, message: "Invalid Aadhar number." });
    }

    // Check if Aadhar is already registered
    const existingUser = await User.findOne({ aadhar: Number(aadhar) });
    if (existingUser) {
      logger.warn(`Signup failed: Aadhar already registered - ${aadhar}`);
      return res.status(400).json({
        success: false,
        message: "Aadhar number is already registered. Please login or use another Aadhar.",
      });
    }

    if (role === "admin") {
      logger.info(`Admin signup attempt by: ${name}`);
      // Admin accounts need a secret key known only to the deployer
      if (!process.env.ADMIN_SIGNUP_KEY || adminKey !== process.env.ADMIN_SIGNUP_KEY) {
        logger.warn(`Admin creation failed: invalid admin key - ${name}`);
        return res.status(403).json({
          success: false,
          message: "Not allowed to create an admin account.",
        });
      }
      const adminExists = await User.findOne({ role: "admin" });
      if (adminExists) {
        logger.warn(`Admin creation failed: Admin already exists - ${adminExists.name}`);
        return res.status(400).json({
          success: false,
          message: "Admin already exists. Only one admin is allowed.",
        });
      }
    }

    // Create new user
    const user = new User({
      name,
      email,
      age,
      mobile,
      address,
      aadhar,
      role: role === "admin" ? "admin" : "voter",
      password,
    });

    const savedUser = await user.save();

    const payload = { id: savedUser.id };
    logger.info(`New user registered: ${name}`);
    const token = generateToken(payload);

    res.status(201).json({
      success: true,
      message: "Person successfully created.",
      data: { id: savedUser.id, name: savedUser.name, role: savedUser.role },
      token: token,
    });
  } catch (err) {
    logger.error(`Signup error: ${err.message}`);
    res.status(400).json({
      success: false,
      message: "Validation failed or other error occurred.",
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
    const requester = await User.findById(req.user.id);
    if (!requester || requester.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized user" });
    }
    const users = await User.find().select("-password");
    logger.info(`Fetched ${users.length} users`);
    res.json(users);
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const showProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching user: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (
    typeof oldPassword !== "string" ||
    typeof newPassword !== "string" ||
    newPassword.length < 8
  ) {
    return res.status(400).json({
      message: "New password must be at least 8 characters.",
    });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (await bcrypt.compare(oldPassword, user.password)) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      logger.info(`Password changed for user: ${user.aadhar}`);
      res.json({ message: "Password changed successfully" });
    } else {
      logger.warn(`Incorrect old password for user: ${user.aadhar}`);
      res.status(400).json({ message: "Incorrect old password" });
    }
  } catch (err) {
    logger.error(`Error changing password: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { signup, login, getAllPersons, showProfile, changePassword };
