const mongoose = require('mongoose');

// Define the schema
const userSchema =
    new mongoose.Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        bio: {
            type: String
        },
        accessLevel: {
            type: Number,
            required: true,
        }
    });

// Create the User Model
const User = mongoose.model('User', userSchema);

module.exports = User;