const express = require("express");
const router = express.Router();
const Review = require("../models/ReviewSchema");
const auth = require("../middleware/auth");

// Create review
router.post("/", auth, async (req, res) => {
  const { gameSlug, reviewText, rating, completed } = req.body;
  try {
    const review = await Review.create({
      userId: req.user.userId,
      gameSlug,
      reviewText,
      rating,
      completed
    });

    await User.findByIdAndUpdate(req.user.userId, { $inc: { "stats.gamesReviewed": 1 } });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


//get by rating
router.get("/popular", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ rating: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Update review
router.put("/:reviewId", auth, async (req, res) => {
  const { reviewId } = req.params;
  const { reviewText, rating, completed } = req.body;

  try {
    const review = await Review.findById(reviewId);

    if (!review) return res.status(404).json({ error: "Review not found" });

    // Make sure the user owns this review
    if (review.userId.toString() !== req.user.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Update fields
    if (reviewText !== undefined) review.reviewText = reviewText;
    if (rating !== undefined) review.rating = rating;
    if (completed !== undefined) review.completed = completed;

    await review.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete review
router.delete("/:reviewId", auth, async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);

    if (!review) return res.status(404).json({ error: "Review not found" });

    // Make sure the user owns this review
    if (review.userId.toString() !== req.user.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await Review.deleteOne({ _id: reviewId });

    await User.findByIdAndUpdate(req.user.userId, { $inc: { "stats.gamesReviewed": -1 } });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;