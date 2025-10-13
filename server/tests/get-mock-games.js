//
const express = require("express");
const axios = require("axios");
const router = express.Router();

let cachedGames = null; // memory cache

router.get("/", async (req, res) => {
  try {
    if (cachedGames) {
      // return cached games
      return res.json(cachedGames);
    }

    // Fetch 10 games from RAWG
    const response = await axios.get("https://api.rawg.io/api/games", {
      params: {
        key: process.env.RAWG_API_KEY,
        page_size: 10
      }
    });

    cachedGames = response.data.results; // store in memory
    res.json(cachedGames);
  } catch (err) {
    console.error("Failed to fetch mock games:", err.message);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

module.exports = router;
