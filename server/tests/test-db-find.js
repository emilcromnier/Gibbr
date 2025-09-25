const mongoose = require("mongoose");
const User = require("../models/UserSchema");
const Review = require("../models/ReviewSchema");

async function testDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb://root:pass@localhost:27017/gibbr?authSource=admin",
      {
        serverSelectionTimeoutMS: 5000,
      }
    );
    console.log("MongoDB connected successfully!");

    // 1️⃣ Ensure user exists
    let user = await User.findOne({ username: "Soff" });
    if (!user) {
      user = await User.create({ username: "Soff", password: "hash123" });
      console.log("Created user:", user.username);
    }

    // 2️⃣ Create a couple of reviews if none exist
    const existingReviews = await Review.find({ userId: user._id });
    if (existingReviews.length === 0) {
      await Review.create([
        {
          userId: user._id,
          gameId: 101,
          reviewText: "Amazing game!",
          rating: 10,
          completed: true,
        },
        {
          userId: user._id,
          gameId: 102,
          reviewText: "Pretty fun",
          rating: 8,
          completed: false,
        },
      ]);
      console.log("Created 2 test reviews for Soff");
    }

    // 3️⃣ Fetch all reviews for Soff
    const soffsReviews = await Review.find({ userId: user._id });
    console.log(`\nAll reviews for ${user.username}:`);
    soffsReviews.forEach((r) => {
      console.log(
        `GameID: ${r.gameId}, Rating: ${r.rating}, Completed: ${r.completed}, Text: "${r.reviewText}"`
      );
    });
  } catch (err) {
    console.error("Error during test:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

// Run the test
testDatabase();
