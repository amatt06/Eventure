const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all users (Test Only)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({error: 'Server error while fetching users'});
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
        console.error('Error creating user:', err);
        res.status(400).json({error: 'Error creating user'});
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
        console.error('Error fetching user by ID:', err);
        res.status(500).json({error: 'Server error while fetching user'});
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
        console.error('Error updating user:', err);
        res.status(400).json({error: 'Error updating user'});
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json({message: 'User deleted successfully'});
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({error: 'Server error while deleting user'});
    }
});

module.exports = router;