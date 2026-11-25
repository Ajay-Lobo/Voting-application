import bcrypt from "bcrypt";
import logger from "../utils/logger.js";
import { User } from "../models/index.js";

const MIN_PASSWORD_LENGTH = 8;

const hashPassword = async (req, res, next) => {
  const { password } = req.body;
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      success: false,
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
  }
  try {
    req.body.password = await bcrypt.hash(password, 10);
    next();
  } catch (err) {
    logger.error(`Hashing password error: ${err.message}`);
    res.status(400).json({
      success: false,
      message: "Hashing password failed.",
    });
  }
};

const comparePassword = async (req, res, next) => {
  const { aadhar, password } = req.body;

  // Reject non-primitive input so query operators (e.g. {"$gt": ""}) cannot reach MongoDB
  if (
    (typeof aadhar !== "string" && typeof aadhar !== "number") ||
    typeof password !== "string"
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const user = await User.findOne({ aadhar: Number(aadhar) });
    // Same response for unknown user and wrong password, so accounts cannot be enumerated
    const validPassword = user && (await bcrypt.compare(password, user.password));
    if (!validPassword) {
      logger.warn(`Failed login attempt: ${aadhar}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.user = user;
    next();
  } catch (err) {
    logger.error(`Compare password error: ${err.message}`);
    res.status(400).json({
      success: false,
      message: "Login failed.",
    });
  }
};

export { hashPassword, comparePassword };
