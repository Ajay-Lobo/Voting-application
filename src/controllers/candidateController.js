import logger from "../utils/logger.js";
import { Candidate, User } from "../models/index.js";

const isAdmin = async (userID) => {
  try {
    const user = await User.findById(userID);
    return user.role === "admin";
  } catch (err) {
    logger.error(`Error checking admin status: ${err.message}`);
    return false;
  }
};

const addCandidate = async (req, res) => {
  const { name, party, age } = req.body;

  try {
    if (!(await isAdmin(req.user.id))) {
      logger.warn(
        `Unauthorized user tried to create candidate: ${req.user.aadhar}`
      );
      return res.status(403).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const candidate = new Candidate({
      name,
      party,
      age,
    });

    const newCandidate = await candidate.save();

    logger.info(`New Candidate created by name: ${name}`);

    res.status(201).json({
      success: true,
      message: "New candidate successfully created.",
      data: newCandidate,
    });
  } catch (err) {
    // Log error
    logger.error(`Candidate creation error: ${err.message}`);

    res.status(400).json({
      success: false,
      message: "Validation failed or other error occurred.",
      error: err.message,
    });
  }
};

const updateCandidate = async (req, res) => {
  const { name, party, age } = req.body;
  const { id } = req.params;

  try {
    if (!(await isAdmin(req.user.id))) {
      logger.warn(
        `Unauthorized user tried to update candidate: ${req.user.aadhar}`
      );
      return res.status(403).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    candidate.name = name;
    candidate.party = party;
    candidate.age = age;

    const updatedCandidate = await candidate.save();

    logger.info(`Candidate updated by name: ${name}`);

    res.status(200).json({
      success: true,
      message: "Candidate successfully updated.",
      data: updatedCandidate,
    });
  } catch (err) {
    // Log error
    logger.error(`Candidate update error: ${err.message}`);

    res.status(400).json({
      success: false,
      message: "Validation failed or other error occurred.",
      error: err.message,
    });
  }
};

const deleteCandidate = async (req, res) => {
  const { id } = req.params;

  try {
    if (!(await isAdmin(req.user.id))) {
      logger.warn(
        `Unauthorized user tried to delete candidate: ${req.user.aadhar}`
      );
      return res.status(403).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    await Candidate.deleteOne({ _id: id });

    logger.info(`Candidate deleted by name: ${candidate.name}`);

    res.status(200).json({
      success: true,
      message: "Candidate successfully deleted.",
    });
  } catch (err) {
    // Log error
    logger.error(`Candidate delete error: ${err.message}`);

    res.status(400).json({
      success: false,
      message: "Validation failed or other error occurred.",
      error: err.message,
    });
  }
};

const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();

    res.status(200).json({
      success: true,
      message: "Candidates retrieved successfully.",
      data: candidates,
    });
  } catch (err) {
    // Log error
    logger.error(`Candidate retrieval error: ${err.message}`);

    res.status(400).json({
      success: false,
      message: "An error occurred while retrieving candidates.",
      error: err.message,
    });
  }
};

export { addCandidate, updateCandidate, deleteCandidate,getCandidates };
