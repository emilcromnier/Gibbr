const mongoose = require("mongoose");

// Use your Atlas URI directly (or store in .env as MONGO_URI)
//const MONGO_URI = "mongodb+srv://gibbradmin:skeletonkey@gibbrcluster.uchffb9.mongodb.net/gibbr?retryWrites=true&w=majority";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
