require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

const logFilePath = path.join(__dirname, 'data/clickstream.json');
const userClicksPath = path.join(__dirname, 'data/userClicks.json');
const usersFilePath = path.join(__dirname, 'data/users.json');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// Import routes
const authMiddleware = require('./authMiddleware');
const featureRoutes = require('./routes/features');
const formulaRoutes = require('./routes/formulas');
const authRoutes = require('./routes/auth'); // Import auth routes

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(limiter);
app.use(bodyParser.json());

// Serve static files from the public directory (e.g., container.js)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the React frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/formulas', formulaRoutes);

// Catch-all handler to serve the React frontend for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});