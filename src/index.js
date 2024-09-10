import env from "dotenv";
import app from "./app.js";
import { connectDB,logger } from "./config/index.js";

env.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => logger.info(`Server running on port ${process.env.PORT}`));
  })
  .catch((error) => {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1); // Exit with failure
  });
