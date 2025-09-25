const mongoose = require("mongoose");
const User = require("../models/UserSchema");
const Review = require("../models/ReviewSchema");

async function testInsert() {
  try {
    // Connect to Mongo running in Docker on localhost
    await mongoose.connect(
      "mongodb://root:pass@localhost:27017/gibbr?authSource=admin",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // fail if cannot connect in 5s
      }
    );
    console.log("MongoDB connected successfully!");
    

    // Create a user
    const user = await User.create({ username: "Soff", password: "hash123" });

    // Create a review for that user
    const review = await Review.create({
      userId: user._id,
      gameId: 12345,
      reviewText: "Amazing game!",
      rating: 10,
      completed: true,
    });

    console.log("Inserted user:", user);
    console.log("Inserted review:", review);

  } catch (err) {
    console.error("Error inserting documents:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

// Run the test
testInsert();


