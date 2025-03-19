import express from 'express';  
import { userController } from "../controllers/index.js";  
import { jwtAuthMiddleware } from "../middlewares/jwt.js"; 
import { hashPassword,comparePassword } from "../middlewares/hashingPassword.js";

const { signup, login, getAllPersons,showProfile,changePassword } = userController;  

const userRouter = express.Router();  

userRouter
  .post("/signup", hashPassword, signup)
  .post("/login",comparePassword, login)
  .get("/", getAllPersons)
  .get("/profile", jwtAuthMiddleware, showProfile)
  .put("/profile/change-password", jwtAuthMiddleware, changePassword);
  

export default userRouter;
