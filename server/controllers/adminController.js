import Feedback from "../models/Feedback.js";
import Sessions from "../models/Sessions.js";
import Users from "../models/Users.js";

/**
 * @param {}
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all Users" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findById(id, "-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch User" });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Sessions.find()
      .populate("student", "name email")
      .populate("tutor", "name email");
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Sessions" });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("student", "name email")
      .populate("tutor", "name email");
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

