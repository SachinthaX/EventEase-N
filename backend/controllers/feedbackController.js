import Feedback from "../models/Feedback.js";

// ✅ Submit Feedback (Logged-in users)
export const submitFeedback = async (req, res) => {
  const { rating, comment, eventId, type } = req.body;

  if (!rating || !comment || !type) {
    return res.status(400).json({ message: "Rating, comment, and type are required." });
  }

  try {
    const feedback = await Feedback.create({
      user: req.user._id,
      event: type === "event" ? eventId : null,
      type,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get All Feedback (Admin View)
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("user", "email");
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Feedback for a Specific Event
export const getEventFeedback = async (req, res) => {
  try {
    const { eventId } = req.params;
    const feedbacks = await Feedback.find({ event: eventId, type: "event" }).populate("user", "email");
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event feedback" });
  }
};



// ✅ Get Logged-in User's Feedback
export const getUserFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id }).populate("event", "eventName"); // ✅ populated
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get a Single Feedback by ID (for edit page)
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate("event", "eventName");


    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this feedback" });
    }

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching feedback" });
  }
};


// ✅ Update Feedback (Only within 24 hours)
export const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    if (feedback.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const timeDiff = (new Date() - feedback.createdAt) / (1000 * 60 * 60);
    if (timeDiff > 24)
      return res.status(403).json({ message: "Editing time expired" });

    feedback.rating = req.body.rating || feedback.rating;
    feedback.comment = req.body.comment || feedback.comment;

    const updatedFeedback = await feedback.save();
    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Feedback (Admin Only)
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    if (req.user.role !== "admin") return res.status(403).json({ message: "Not authorized" });

    await feedback.deleteOne();
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Generate Report (Admin Only)
export const generateReport = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "email")
      .populate("event", "eventName");

    if (!feedbacks.length) {
      return res.status(200).json({
        averageRating: "0.00",
        topComments: [],
        improvementSuggestions: [],
        attendeeSummary: {},
      });
    }

    // ✅ Safely calculate average rating
    const totalRatings = feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0);
    const avgRating = (totalRatings / feedbacks.length).toFixed(2);

    // ✅ Collect top repeated comments
    const commentFreq = {};
    feedbacks.forEach(f => {
      const comment = (f.comment || "").toLowerCase();
      if (comment) {
        commentFreq[comment] = (commentFreq[comment] || 0) + 1;
      }
    });

    const topComments = Object.entries(commentFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([comment]) => comment);

    // ✅ Collect improvement suggestions (ratings < 3)
    const improvementSuggestions = feedbacks
      .filter(f => f.rating < 3 && f.comment)
      .map(f => f.comment)
      .slice(0, 3);

    // ✅ Build per-user summary
    const attendeeSummary = {};
    feedbacks.forEach(f => {
      const email = f.user?.email || "unknown@example.com";
      const rating = f.rating || 0;
      const comment = f.comment || "";

      if (!attendeeSummary[email]) {
        attendeeSummary[email] = {
          total: 0,
          avg: 0,
          comments: [],
          lowRatings: [],
        };
      }

      attendeeSummary[email].total += 1;
      attendeeSummary[email].avg += rating;
      if (comment) attendeeSummary[email].comments.push(comment);
      if (rating < 3 && comment) attendeeSummary[email].lowRatings.push(comment);
    });

    // ✅ Final average calculation per user
    Object.keys(attendeeSummary).forEach(email => {
      const user = attendeeSummary[email];
      user.avg = (user.avg / user.total).toFixed(2);
    });

    res.status(200).json({
      averageRating: avgRating,
      totalFeedbacks: feedbacks.length,
      topComments,
      improvementSuggestions,
      attendeeSummary,
      topRatedUsers: Object.entries(attendeeSummary)
        .sort((a, b) => b[1].avg - a[1].avg)
        .slice(0, 3)
        .map(([email, user]) => ({ email, avg: user.avg })),

      allFeedbacks: feedbacks.map(f => ({
        user: f.user?.email || "unknown",
        type: f.type,
        event: f.event?.eventName || "-",
        rating: f.rating,
        comment: f.comment,
        createdAt: f.createdAt,
      })),
    });

  } catch (error) {
    console.error("⚠️ Feedback report error:", error);
    res.status(500).json({ message: "Server error generating report" });
  }
};
