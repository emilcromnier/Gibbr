/*
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from our server! CocknBalls')
})

app.listen(8080, () => {
    console.log('server listening on port 8080')
})
*/

const app = require("./app");   // Express config in app.js
const connectDB = require("./config/db");

const PORT = process.env.PORT || 9000;

// Connect to Mongo first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});