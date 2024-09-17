// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Sign-In Route
router.post('/signin', async (req, res) => {
    try {
        const {email, password} = req.body;

        // Find user by email
        const user = await User.findOne({email});
        if (!user) {
            console.error('Invalid credentials: User not found');
            return res.status(400).json({message: 'Invalid credentials'});
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Invalid credentials: Incorrect password');
            return res.status(400).json({message: 'Invalid credentials'});
        }

        // Create and send JWT token
        const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token});
    } catch (err) {
        console.error('Server error during sign-in:', err);
        res.status(500).json({message: 'Server error'});
    }
});

// Token Validation Route
router.get('/validate', (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) {
        console.error('Authorization denied: No token provided');
        return res.status(401).json({message: 'No token, authorization denied'});
    }

    // Return token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json(decoded);
    } catch (err) {
        console.error('Token validation failed:', err);
        res.status(401).json({message: 'Token is not valid'});
    }
});

module.exports = router;