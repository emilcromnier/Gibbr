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

// DELETE user account
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Only the user themselves or an admin can delete
    if (req.user.userId !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `User '${deletedUser.username}' deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//------------DIARY ROUTES----------------

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


// ------------------------------ FRIENDS ROUTES ------------------------------

// Get users friends list (id and username only)
router.get("/:username/friends", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("friends", "_id username"); // only _id and username

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a friend
router.post("/:username/friends", auth, async (req, res) => {
  const { username } = req.params;
  const { friendId } = req.body; // ID of the friend to add

  if (!friendId) return res.status(400).json({ error: "friendId is required" });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.user.userId !== user._id.toString())
      return res.status(403).json({ error: "Unauthorized" });

    // Prevent adding duplicates or self
    if (user.friends.includes(friendId))
      return res.status(400).json({ error: "Already friends" });
    if (friendId === user._id.toString())
      return res.status(400).json({ error: "Cannot add yourself" });

    user.friends.push(friendId);
    await user.save();

    res.status(201).json({ message: "Friend added", friendId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a friend
router.delete("/:username/friends/:friendId", auth, async (req, res) => {
  const { username, friendId } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Ensure user is editing their own friends list
    if (req.user.userId !== user._id.toString())
      return res.status(403).json({ error: "Unauthorized" });

    const before = user.friends.length;
    user.friends = user.friends.filter(f => f.toString() !== friendId);

    if (user.friends.length === before)
      return res.status(404).json({ error: "Friend not found in list" });

    await user.save();
    res.json({ message: "Friend removed", friendId });
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

    // Ensure user owns backlog
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
