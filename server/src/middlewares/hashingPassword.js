import bcrypt from "bcrypt";
import logger from "../utils/logger.js";
import { generateToken } from "../middlewares/jwt.js";
import { User } from "../models/index.js";


const hashPassword = async(req,res,next) => {
    const { password } = req.body;
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        req.body.password = hashedPassword;
        next();
    }catch(err){
        logger.error(`Hashing password error: ${err.message}`);
        res.status(400).json({
            success: false,
            message: "Hashing password failed.",
            error: err.message,
        });
    }
}


const comparePassword = async (req,res,next) => {
    const { aadhar, password } = req.body;
    try{
        const user = await User.findOne({ aadhar: aadhar });
        if (!user) {
            logger.warn(`User not found: ${aadhar}`);
            return res.status(401).json({
                error: "User not found",
            });
        }
        const validPassword = await bcrypt.compare(password,user.password);
        if(!validPassword){
            logger.warn(`Invalid password: ${aadhar}`);
            return res.status(401).json({
                error: "Invalid password",
            });
        }
        req.user = user;
        next();
    }
    catch(err){
        logger.error(`Compare password error: ${err.message}`);
        res.status(400).json({
            success: false,
            message: "Compare password failed.",
            error: err.message,
        });
    }
}

export { hashPassword, comparePassword };