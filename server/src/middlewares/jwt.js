import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
};

const jwtAuthMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    logger.warn("Authorization header missing");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    logger.warn("Malformed authorization header");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Pin the algorithm so tokens signed with "none" or another algorithm are rejected
    const decoded = jwt.verify(token, getSecret(), { algorithms: ["HS256"] });
    req.user = decoded;
    next();
  } catch (err) {
    logger.error(`Token verification failed: ${err.message}`);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const generateToken = (userData) => {
  try {
    return jwt.sign(userData, getSecret(), {
      algorithm: "HS256",
      expiresIn: 3600,
    });
  } catch (err) {
    logger.error(`Token generation failed: ${err.message}`);
    throw err;
  }
};

export { jwtAuthMiddleware, generateToken };
