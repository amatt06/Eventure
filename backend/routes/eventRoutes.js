const express = require('express');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Route to create a new event (only accessible by level 1 users)
router.post('/create', authMiddleware(1), async (req, res) => {
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