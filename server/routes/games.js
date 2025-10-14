const express = require("express");
const router = express.Router();
const axios = require("axios");
const Review = require("../models/ReviewSchema");
const API_KEY = process.env.RAWG_API_KEY;

//search games on API
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


//Trending this year
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

// Top rated of all time
router.get("/top-rated", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-metacritic&page_size=20`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all genres
router.get("/genres", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/genres?key=${API_KEY}&page_size=20`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all platforms (useful for filtering)
router.get("/platforms", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/platforms/lists/parents?key=${API_KEY}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get games by genre (e.g., /genre/action or /genre/rpg)
router.get("/genre/:genreSlug", async (req, res) => {
  const { genreSlug } = req.params;
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${API_KEY}&genres=${genreSlug}&page_size=20`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get upcoming games
router.get("/upcoming", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const endDate = nextYear.toISOString().split("T")[0];

    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${API_KEY}&dates=${today},${endDate}&ordering=-added&page_size=20`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recently released games
router.get("/recent", async (req, res) => {
  try {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const startDate = threeMonthsAgo.toISOString().split("T")[0];
    const endDate = today.toISOString().split("T")[0];

    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${API_KEY}&dates=${startDate},${endDate}&ordering=-added&page_size=20`
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
