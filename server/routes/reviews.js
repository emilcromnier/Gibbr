const express = require("express");
const router = express.Router();
const Review = require("../models/ReviewSchema");
const authMiddleware = require("../middleware/auth");

// Create review
router.post("/", authMiddleware, async (req, res) => {
  const { gameId, reviewText, rating, completed } = req.body;
  const review = await Review.create({
    userId: req.user.userId,
    gameId,
    reviewText,
    rating,
    completed
  });
  res.status(201).json(review);
});

// Get reviews by user
router.get("/user/:userId", async (req, res) => {
  const reviews = await Review.find({ userId: req.params.userId });
  res.json(reviews);
});

module.exports = router;
