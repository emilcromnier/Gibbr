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

// Get user's game diary (chronological list)
router.get("/:username/diary", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const diaryEntries = await Review.find({
      userId: user._id,
      completed: true
    })
      .sort({ completedAt: -1 }) // newest first
      .select("gameSlug rating completedAt reviewText liked"); // only needed fields

    res.json(diaryEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:username/backlog", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Return only the slugs — addedAt is internal
    const backlog = user.backlog.map(item => item.gameSlug);
    res.json({ backlog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//-------------------------------BACKLOG ROUTES--------------------------------

// Add game to backlog
router.post("/:username/backlog", auth, async (req, res) => {
  const { username } = req.params;
  const { gameSlug } = req.body;

  if (!gameSlug) return res.status(400).json({ error: "gameSlug is required" });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Ensure user is editing their own backlog
    if (req.user.userId !== user._id.toString())
      return res.status(403).json({ error: "Unauthorized" });

    // Prevent duplicates
    if (user.backlog.some(entry => entry.gameSlug === gameSlug))
      return res.status(400).json({ error: "Game already in backlog" });

    user.backlog.push({ gameSlug }); // addedAt is auto-set by default
    await user.save();

    res.status(201).json({ message: "Game added to backlog", gameSlug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove game from backlog
router.delete("/:username/backlog/:gameSlug", auth, async (req, res) => {
  const { username, gameSlug } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Ensure user owns this backlog
    if (req.user.userId !== user._id.toString())
      return res.status(403).json({ error: "Unauthorized" });

    const before = user.backlog.length;
    user.backlog = user.backlog.filter(entry => entry.gameSlug !== gameSlug);

    if (user.backlog.length === before)
      return res.status(404).json({ error: "Game not found in backlog" });

    await user.save();

    res.json({ message: "Game removed from backlog" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//------------------------------CURRENTLY PLAYING ROUTES-----------------------------


// get "currently playing" games
router.get("/:username/currently-playing", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const playing = user.currentlyPlaying.map(item => item.gameSlug);
    res.json({ currentlyPlaying: playing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add game to currently playing
router.post("/:username/currently-playing", auth, async (req, res) => {
  const { username } = req.params;
  const { gameSlug } = req.body;

  if (!gameSlug) return res.status(400).json({ error: "gameSlug is required" });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.user.userId !== user._id.toString())
      return res.status(403).json({ error: "Unauthorized" });

    if (user.currentlyPlaying.some(entry => entry.gameSlug === gameSlug))
      return res.status(400).json({ error: "Game already marked as currently playing" });

    user.currentlyPlaying.push({ gameSlug });
    await user.save();

    res.status(201).json({ message: "Game added to currently playing", gameSlug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove game from currently playing (both on completion or manual removal)
router.delete("/:username/currently-playing/:gameSlug", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.user.userId !== user._id.toString())
      return res.status(403).json({ error: "Unauthorized" });

    const before = user.currentlyPlaying.length;
    user.currentlyPlaying = user.currentlyPlaying.filter(
      entry => entry.gameSlug !== req.params.gameSlug
    );

    if (user.currentlyPlaying.length === before)
      return res.status(404).json({ error: "Game not found in currently playing list" });

    await user.save();
    res.json({ message: "Game removed from currently playing", gameSlug: req.params.gameSlug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
