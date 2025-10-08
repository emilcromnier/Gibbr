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

router.get("/trending", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${API_KEY}&dates=${currentYear}-01-01,${currentYear}-12-31&ordering=-added&page_size=20`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//ID
router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params; // get the ID from the URL
    const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
    res.json(response.data); // send back the single game object
  } catch (err) {
    console.error("Error fetching game by ID:", err.message);
    res.status(500).json({ error: err.message });
  }
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
