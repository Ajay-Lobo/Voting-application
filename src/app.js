import express from "express";
import logger  from "./utils/logger.js";
import bodyparser from "body-parser";
import router from "./routes/index.js";
const app = express();

app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use('/api', router); 

app.use((req, res, next) => {
  logger.info(`Received request: ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware
});

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
