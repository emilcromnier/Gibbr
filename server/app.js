const express = require("express");
const cors = require("cors");
//const helmet = require("helmet");
//const morgan = require("morgan");



const app = express();
app.use(express.json());

// Middleware
//app.use(helmet());
//app.use(morgan("dev"));

app.use(cors({ origin: "http://localhost:8080" }));

// Test route
app.get("/", (req, res) => {
  res.send("Hello from GibbR backend!");
});

//routes
const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/reviews");
const gameRoutes = require("./routes/games");
const userRoutes = require("./routes/users");

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/users", userRoutes);

// Mock games route for testing
const mockGamesRoute = require("./tests/get-mock-games");
app.use("/api/mock-games", mockGamesRoute);


module.exports = app;