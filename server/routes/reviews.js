const express = require("express");
const router = express.Router();
const Review = require("../models/ReviewSchema");
const User = require("../models/UserSchema");
const auth = require("../middleware/auth");

// Create review
// Create review
router.post("/", auth, async (req, res) => {
  const { gameSlug, reviewText, rating, completed, liked } = req.body;

  try {
    const review = await Review.create({
      userId: req.user.userId,
      gameSlug,
      reviewText,
      rating,
      completed,
      liked,
      completedAt: completed ? new Date() : null
    });

    // If completed, update user stats & remove from currentlyPlaying
    if (completed) {
      const user = await User.findById(req.user.userId);
      if (user) await user.markGameCompleted(gameSlug);
    }

    // Use the schema's toJSON transform to remove _id
    res.status(201).json(review.toJSON());

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Get all reviews by recency
router.get("/recent", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }); // newest first
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Update review
router.put("/:reviewId", auth, async (req, res) => {
  const { reviewId } = req.params;
  const { reviewText, rating, completed, liked } = req.body;

  try {
    const review = await Review.findById(reviewId);

    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.userId.toString() !== req.user.userId) return res.status(401).json({ error: "Unauthorized" });

    // Update fields
    if (reviewText !== undefined) review.reviewText = reviewText;
    if (rating !== undefined) review.rating = rating;
    if (liked !== undefined) review.liked = liked;

    if (completed !== undefined) {
      if (!review.completed && completed) {
        review.completed = true;
        review.completedAt = new Date();

        const user = await User.findById(req.user.userId);
        if (user) await user.markGameCompleted(review.gameSlug);
      } else if (review.completed && !completed) {
        review.completed = false;
        review.completedAt = null;
      }
    }

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

    // owner and admin can delete reviews
    if (review.userId.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await Review.deleteOne({ _id: reviewId });

    // Decrement stats for the review owner
    const user = await User.findById(review.userId);
    if (user) {
      user.stats.gamesReviewed = Math.max(0, user.stats.gamesReviewed - 1);
      await user.save();
    }

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;