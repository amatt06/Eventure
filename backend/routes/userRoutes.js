const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json(users); // Send the users as a JSON response
    } catch (err) {
        res.status(500).json({error: err.message}); // Handle errors
    }
});

// Create a new user
router.post('/', async (req, res) => {
    try {
        const {firstName, lastName, email, password, bio, accessLevel} = req.body;
        const newUser = new User({firstName, lastName, email, password, bio, accessLevel});
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!updatedUser) {
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

//Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json({message: 'User deleted successfully'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;