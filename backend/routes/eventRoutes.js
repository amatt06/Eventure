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
        const { title, description, date, location, invitees } = req.body;

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            organiser_id: req.user.id,
            invitees: invitees || []
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

        // Manage invitees
        if (req.body.invitees) {
            event.invitees = req.body.invitees;
        }

        // Save the updated event
        await event.save();
        res.json({ message: 'Event updated successfully', event });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a specific event (only accessible by the organiser)
router.delete('/:id', authMiddleware(1), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the user is the organiser of the event
        if (event.organiser_id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: Only the organiser can delete this event' });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// RSVP to an event
router.post('/:id/rsvp', authMiddleware(0), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the user is the organiser
        if (event.organiser_id.toString() === req.user.id) {
            return res.status(403).json({ message: 'Access denied: Organisers cannot RSVP to their own events' });
        }

        // Check if the user is an invitee
        if (!event.invitees.includes(req.user.email)) {
            return res.status(403).json({ message: 'Access denied: You are not invited to this event' });
        }

        // Check if the user is already in the RSVP responses
        const existingResponse = event.rsvp_responses.find(r => r.email === req.user.email);

        if (existingResponse) {
            // Update existing RSVP response to true
            existingResponse.hasRSVPd = true;
        } else {
            // Create a new RSVP response with hasRSVPd set to true
            event.rsvp_responses.push({ email: req.user.email, hasRSVPd: true });
        }

        // Save the updated event
        await event.save();
        res.json({ message: 'RSVP updated successfully', rsvpResponses: event.rsvp_responses });
    } catch (err) {
        console.error('Error responding to RSVP:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Un-RSVP to an event -- Remove user from list.
router.post('/:id/unrsvp', authMiddleware(0), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the user is the organiser
        if (event.organiser_id.toString() === req.user.id) {
            return res.status(403).json({ message: 'Access denied: Organisers cannot un-RSVP for their own events' });
        }

        // Remove the user from the RSVP responses array
        const initialLength = event.rsvp_responses.length;
        event.rsvp_responses = event.rsvp_responses.filter(r => r.email !== req.user.email);

        // Check if the RSVP was removed
        if (event.rsvp_responses.length === initialLength) {
            return res.status(404).json({ message: 'RSVP not found for this user' });
        }

        // Save the updated event
        await event.save();
        res.json({ message: 'RSVP removed successfully', rsvpResponses: event.rsvp_responses });
    } catch (err) {
        console.error('Error responding to un-RSVP:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;