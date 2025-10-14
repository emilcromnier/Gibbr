const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const secret = process.env.JWT_SECRET;

// Get current logged-in user (based on token)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: "User created", userId: user._id });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
  }); //wait for either username or email
  console.log(user);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
  res.json({ message: "Login Success", token });
});

module.exports = router;
