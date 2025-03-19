import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },

  aadhar: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "voter"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
