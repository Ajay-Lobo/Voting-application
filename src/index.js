import env from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/index.js";

env.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1); // Exit with failure
  });
