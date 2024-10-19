const mongoose = require('mongoose');

// Define the schema for events
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    organiser_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    invitees: {
        type: [String],
        default: []
    },
    rsvp_responses: {
        type: [{
            email: {
                type: String,
                required: true
            },
            hasRSVPd: {
                type: Boolean,
                default: false
            }
        }],
        default: []
    }
});

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;