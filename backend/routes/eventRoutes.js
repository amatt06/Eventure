const express = require('express');
const Event = require('../models/Event');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to verify token and extract user info
const verifyToken = (req, res, next) => {
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
};

// Create a new event (Organizers only - Level 1)
router.post('/events', verifyToken, async (req, res) => {
    try {
        if (req.user.accessLevel !== 1) {
            return res.status(403).json({ message: 'Access denied. Only organizers can create events.' });
        }

        const { title, description, date, location, invitees } = req.body;

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            organiser_id: req.user.id, // Organizer is the logged-in user
            invitees
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ error: 'Server error while creating event' });
    }
});

// RSVP to an event (Attendees only - Level 0)
router.post('/rsvp', verifyToken, async (req, res) => {
    try {
        if (req.user.accessLevel !== 0) {
            return res.status(403).json({ message: 'Access denied. Only attendees can RSVP to events.' });
        }

        const { eventId, hasRSVPd } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const invitee = event.rsvp_responses.find(rsvp => rsvp.email === req.user.email);
        if (invitee) {
            invitee.hasRSVPd = hasRSVPd;
        } else {
            event.rsvp_responses.push({ email: req.user.email, hasRSVPd });
        }

        await event.save();
        res.status(200).json(event);
    } catch (err) {
        console.error('Error updating RSVP:', err);
        res.status(500).json({ error: 'Server error while updating RSVP' });
    }
});

// Update an event (Organizer only)
router.put('/events/:id', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.organiser_id.toString() !== req.user.id || req.user.accessLevel !== 1) {
            return res.status(403).json({ message: 'Access denied. Only the organizer can update this event.' });
        }

        const { title, description, date, location, invitees } = req.body;
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;
        event.invitees = invitees || event.invitees;

        await event.save();
        res.status(200).json(event);
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ error: 'Server error while updating event' });
    }
});

module.exports = router;