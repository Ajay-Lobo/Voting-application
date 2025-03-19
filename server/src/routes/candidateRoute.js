import express from "express";
import { candidateController } from "../controllers/index.js";
import { jwtAuthMiddleware } from "../middlewares/jwt.js";

const { addCandidate, updateCandidate, deleteCandidate, getCandidates } =
  candidateController;

const candidateRouter = express.Router();

candidateRouter
  .post("/",jwtAuthMiddleware, addCandidate)
  .put("/:id",jwtAuthMiddleware, updateCandidate)
  .delete("/:id",jwtAuthMiddleware, deleteCandidate)
  .get("/", getCandidates);

export default candidateRouter;
