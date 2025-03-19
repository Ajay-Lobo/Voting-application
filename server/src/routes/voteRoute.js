import express from 'express';
import { voteController } from "../controllers/index.js";
import { jwtAuthMiddleware } from "../middlewares/jwt.js";

const { voteCandidate, voteCount } = voteController;

const voteRouter = express.Router();

voteRouter.post("/:id", jwtAuthMiddleware, voteCandidate);
voteRouter.get("/count", voteCount);

export default voteRouter;