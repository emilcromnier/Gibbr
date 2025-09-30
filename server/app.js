const express = require("express");
const cors = require("cors");
//const helmet = require("helmet");
//const morgan = require("morgan");

const User = require("./models/UserSchema.js"); //for testing

const app = express();

// Middleware
//app.use(helmet());
//app.use(morgan("dev"));

app.use(cors({ origin: "http://localhost:9000" }));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello from GibbR backend!");
});

// TODO: add routes later
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/reviews", require("./routes/reviews"));

module.exports = app;