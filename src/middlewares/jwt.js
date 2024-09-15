import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../utils/logger.js"; // Import your logger

dotenv.config();

const jwtAuthMiddleware = (req, res, next) => {
  // Check for authorization header
  if (!req.headers.authorization) {
    logger.warn("Authorization header missing");
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  // Extract the JWT token from the request header
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    logger.warn("Token not found in authorization header");
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user information to the request object
    req.user = decoded;
    logger.info("Token verified for user");
    next();
  } catch (err) {
    logger.error(`Token verification failed: ${err.message}`);
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
};

// Function to generate token
const generateToken = (userData) => {
  try {
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    logger.info("Token generated for user");
    return token;
  } catch (err) {
    logger.error(`Token generation failed: ${err.message}`);
    throw err;
  }
};

export { jwtAuthMiddleware, generateToken };
