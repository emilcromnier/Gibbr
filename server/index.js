
const app = require("./app");   // Express config in app.js
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8080;

// Connect to Mongo first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});