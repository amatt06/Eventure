const express = require('express');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get all events (no access level restriction -- TEST ONLY)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

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

// Get events for the logged-in user (organiser and attendee)
router.get('/user', authMiddleware(0), async (req, res) => {
    try {
        const events = await Event.find({
            $or: [
                { organiser_id: req.user.id },
                { invitees: req.user.email },
                { 'rsvp_responses.email': req.user.email }
            ]
        });
        res.json(events);
    } catch (err) {
        console.error('Error fetching user events:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;