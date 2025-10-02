const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
//const Review = require("../models/ReviewSchema");
const auth = require("../middleware/auth");

// Get user by username
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password"); // exclude password
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//get users reviews
router.get("/:username/reviews", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate("reviews"); //uses virtual
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
