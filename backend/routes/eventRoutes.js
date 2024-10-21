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

// Get events for the logged-in user (all user levels)
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

// Get a specific event by ID
router.get('/:id', authMiddleware(0), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a specific event (only accessible by the organiser)
router.put('/:id', authMiddleware(1), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the user is the organiser of the event
        if (event.organiser_id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: Only the organiser can update this event' });
        }

        // Update event details
        event.title = req.body.title || event.title;
        event.description = req.body.description || event.description;
        event.date = req.body.date || event.date;
        event.location = req.body.location || event.location;

        await event.save();
        res.json({ message: 'Event updated successfully', event });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;