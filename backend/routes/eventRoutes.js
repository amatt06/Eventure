// routes/eventRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const router = express.Router();

// Middleware to verify token and check access level
function verifyToken(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
}

// Check if user is an organiser (access level 1)
function checkOrganizer(req, res, next) {
    if (req.user.accessLevel !== 1) {
        return res.status(403).json({ message: 'Access denied: Only organizers can create events' });
    }
    next();
}

// Route to create a new event (only accessible by level 1 users)
router.post('/create', verifyToken, checkOrganizer, async (req, res) => {
    try {
        const { title, description, date, location } = req.body;

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            organiser_id: req.user.id
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;