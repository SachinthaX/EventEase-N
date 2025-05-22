import express from "express";
import {
  submitFeedback,
  getAllFeedback,
  getUserFeedback,
  getFeedbackById, // ✅ added
  updateFeedback,
  deleteFeedback,
  generateReport,
  getEventFeedback,
} from "../controllers/feedbackController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🛠️ Admin
router.delete("/:id", protect, deleteFeedback);
router.get("/report/summary", protect, adminOnly, generateReport);
// 📝 User Feedback
router.post("/", protect, submitFeedback);
router.get("/mine", protect, getUserFeedback);
router.get("/:id", protect, getFeedbackById); // ✅ added for edit page
router.put("/:id", protect, updateFeedback);
router.get("/event/:eventId", getEventFeedback);
router.get("/", getAllFeedback); // public read access



export default router;
