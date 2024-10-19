const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const router = express.Router();

// Create a new event (Admins only)
router.post('/events', async (req, res) => {
    try {
        const {title, description, date, location, organiser_id, invitees} = req.body;

        // Create new event instance
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            organiser_id,
            invitees
        });

        // Save event to the database
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({error: 'Server error while creating event'});
    }
});

// Get all events (for a user - either created or invited to)
router.get('/events', async (req, res) => {
    try {
        const {userId} = req.query;  // Assume the user ID is passed in the query string

        // Find events where the user is the organiser or an invitee
        const events = await Event.find({
            $or: [{organiser_id: userId}, {invitees: userId}]
        });

        res.status(200).json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({error: 'Server error while fetching events'});
    }
});

// Get a specific event by ID
router.get('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({error: 'Event not found'});
        }
        res.status(200).json(event);
    } catch (err) {
        console.error('Error fetching event by ID:', err);
        res.status(500).json({error: 'Server error while fetching event'});
    }
});

// Update an event (Admins only)
router.put('/events/:id', async (req, res) => {
    try {
        const {title, description, date, location, invitees} = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            {title, description, date, location, invitees},
            {new: true}
        );
        if (!updatedEvent) {
            return res.status(404).json({error: 'Event not found'});
        }
        res.status(200).json(updatedEvent);
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({error: 'Server error while updating event'});
    }
});

// RSVP to an event
router.post('/rsvp', async (req, res) => {
    try {
        const {eventId, email, hasRSVPd} = req.body;

        // Find the event and update the RSVP response
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({error: 'Event not found'});
        }

        // Update the RSVP status for the invitee
        const invitee = event.rsvp_responses.find(rsvp => rsvp.email === email);
        if (invitee) {
            invitee.hasRSVPd = hasRSVPd;
        } else {
            // Add a new RSVP response if the invitee was not previously tracked
            event.rsvp_responses.push({email, hasRSVPd});
        }

        await event.save();
        res.status(200).json(event);
    } catch (err) {
        console.error('Error updating RSVP:', err);
        res.status(500).json({error: 'Server error while updating RSVP'});
    }
});

module.exports = router;
