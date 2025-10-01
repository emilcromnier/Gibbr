const express = require("express");
const cors = require("cors");
//const helmet = require("helmet");
//const morgan = require("morgan");


const app = express();
app.use(express.json());

// Middleware
//app.use(helmet());
//app.use(morgan("dev"));

app.use(cors({ origin: "http://localhost:9000" }));

// Test route
app.get("/", (req, res) => {
  res.send("Hello from GibbR backend!");
});

//routes
const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/reviews");
const gameRoutes = require("./routes/games");

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/games", gameRoutes);

module.exports = app;