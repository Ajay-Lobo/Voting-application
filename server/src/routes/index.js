import express from "express";
import userRouter from "./userRoutes.js";
import candidateRouter from "./candidateRoute.js";
import voteRouter from "./voteRoute.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/candidates",candidateRouter);
router.use("/votes", voteRouter);

export default router;
