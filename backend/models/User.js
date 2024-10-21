const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema
const userSchema = new mongoose.Schema({
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

// Hash the password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Hashing logic for updating users.
userSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();

    // Check if the password field is being updated
    if (update.password) {
        try {
            const salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(update.password, salt);
            this.setUpdate(update);
        } catch (err) {
            return next(err);
        }
    }

    next();
});

// Create the User Model
const User = mongoose.model('User', userSchema);

module.exports = User;