// JavaScript source code
// backend/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config(); // Loads variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// ================== MIDDLEWARE ==================
// Security headers
app.use(helmet());
// Allow requests from your React frontend (running on port 3000)
app.use(cors({ origin: 'http://localhost:3000' }));
// Log incoming requests to the console
app.use(morgan('combined'));
// Parse incoming requests with JSON payloads
app.use(express.json());

// ================== BASIC ROUTE (Health Check) ==================
// This is the first thing you test!
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from GibbR API!' });
});

// ================== START THE SERVER ==================
app.listen(PORT, () => {
    console.log(`Gibbr backend server is running on port ${PORT}`);
});