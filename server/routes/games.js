const express = require("express");
const router = express.Router();
const axios = require("axios");
const API_KEY = process.env.RAWG_API_KEY;

router.get("/search", async (req, res) => {
  const { query } = req.query;
  const response = await axios.get(`https://api.rawg.io/api/games?search=${query}&key=${API_KEY}`);
  res.json(response.data);
});

module.exports = router;
