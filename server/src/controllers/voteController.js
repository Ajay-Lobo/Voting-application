import logger from "../utils/logger.js";
import { Candidate, User } from "../models/index.js";

const voteCandidate = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  console.log(id, userId);
  try {
    // Find candidate by ID
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      logger.warn(`Vote failed - Candidate not found: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`Vote failed - User not found: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has already voted
    if (user.isVoted) {
      logger.warn(`Vote failed - User already voted: ${userId}`);
      return res.status(403).json({
        success: false,
        message: "User already voted",
      });
    }

    // Prevent admins from voting
    if (user.role === "admin") {
      logger.warn(`Vote failed - Admin cannot vote: ${userId}`);
      return res.status(403).json({
        success: false,
        message: "Admin cannot vote",
      });
    }

    // Record the vote
    candidate.votes.push({ user: userId });
    candidate.voteCount += 1;

    // Save candidate and update user vote status
    await candidate.save();
    user.isVoted = true;
    await user.save();

    logger.info(`Vote successful - User: ${userId}, Candidate: ${id}`);
    res.status(200).json({
      success: true,
      message: "Vote casted successfully",
    });
  } catch (err) {
    logger.error(`Vote cast error: ${err.message}`);
    res.status(400).json({
      success: false,
      message: "An error occurred while casting vote",
      error: err.message,
    });
  }
};

const voteCount = async (req, res) => {
  try {
    const candidate = await Candidate.find().sort({ voteCount: -1 });
    const record = candidate.map((data) => {
      return { name: data.name, party: data.party, voteCount: data.voteCount };
    });
    res.status(200).json({
      success: true,
      message: "Vote count",
      data: record,
    });
  } catch (err) {
    logger.error(`Vote count error: ${err.message}`);
    res.status(400).json({
      success: false,
      message: "Validation failed or other error occurred",
      error: err.message,
    });
  }
};

export { voteCandidate, voteCount };
