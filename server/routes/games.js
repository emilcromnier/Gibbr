const express = require("express");
const router = express.Router();
const axios = require("axios");
const Review = require("../models/ReviewSchema");
const API_KEY = process.env.RAWG_API_KEY;

router.get("/search", async (req, res) => {
  const { query } = req.query;
  const response = await axios.get(`https://api.rawg.io/api/games?search=${query}&key=${API_KEY}`);
  res.json(response.data);
});

 // Find all reviews for this game
router.get("/:gameSlug/reviews", async (req, res) => {
  const { gameSlug } = req.params;
  try {
    const reviews = await Review.find({ gameSlug });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
