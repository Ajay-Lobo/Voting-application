import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import logger from "./utils/logger.js";
import router from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
      : "http://localhost:5173",
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use((req, res, next) => {
  logger.info(`Received request: ${req.method} ${req.url}`);
  next();
});

// Slow down brute-force attempts on login and signup
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, try again later." },
});
app.use("/api/users/login", authLimiter);
app.use("/api/users/signup", authLimiter);

app.use("/api", router);

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
