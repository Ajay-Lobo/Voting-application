import logger from "../utils/logger.js";
import { User } from "../models/index.js";
import { generateToken} from "../middlewares/jwt.js";
import bcrypt from "bcrypt";

const signup = async (req, res) => {
  const {
    name,
    email,
    age,
    mobile,
    address,
    aadhar,
    role,
    password,
  } = req.body;

  try {
    const user = new User({
    name,
    email,
    age,
    mobile,
    address,
    aadhar,
    role,
    password
    });

    const savedUser = await user.save();

    const payload = {
      id: savedUser.id,
      username: savedUser.aadhar,
    };

    logger.info(`New user registered: ${name}`);
    const token = generateToken(payload);

    res.status(201).json({
      success: true,
      message: "Person successfully created.",
      data: savedUser,
      token: token,
    });
  } catch (err) {
    // Log error
    logger.error(`Signup error: ${err.message}`);

    res.status(400).json({
      success: false,
      message: "Validation failed or other error occurred.",
      error: err.message,
    });
  }
};


const login =  async(req,res)=>{
    const {username,password} = req.body;
    logger.info(`Login attempt for username: ${username}`);

    try{
        const user = await User.findOne({ username: username });
        
        if(!user){
            logger.warn(`User not found: ${username}`);
            return res.status(401).json({
                error: "User not found",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            logger.warn(`Incorrect password for username: ${name}`);
            return res.status(401).json({
                error: "Incorrect password",
            });
        }
        const payload = {
            id: user.id,
            username: user.username,
        };
        const token = generateToken(payload);
        logger.info(`Login successful for username: ${name}`);
        res.json({
            success: true,
            message: "Login successful",
            token: token,
        });
    }
    catch(err){
        logger.error(`Login error: ${err.message}`);
        res.status(401).json({
            error: "Unauthorized",
        });
    }
}




const getAllPersons = async (req, res) => {
  try {
    const users = await User.find(); 
    logger.info(`Fetched ${users.length} users`); 
    res.json(users); 
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`); 
    res.status(500).json({ message: err.message });
  }
};




export { signup , login, getAllPersons };
