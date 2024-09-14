import express from 'express';  
import { userController } from "../controllers/index.js";  
import { jwtAuthMiddleware } from "../middlewares/jwt.js"; 

const { signup, login, getAllPersons } = userController;  

const userRouter = express.Router();  

// Define routes
userRouter.post("/signup", signup);              
userRouter.post("/login", login);                 
userRouter.get("/", getAllPersons);  

export default userRouter;
