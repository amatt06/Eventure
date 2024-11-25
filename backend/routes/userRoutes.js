const express = require('express');
const User = require('../models/User');
const router = express.Router();
const uploadAvatar = require('../middleware/uploadAvatar');
const authMiddleware = require('../middleware/authMiddleware');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Get all users (Test Only)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Server error while fetching users' });
    }
});

// Create a new user
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, password, accessLevel } = req.body;
        const newUser = new User({ firstName, lastName, email, password, accessLevel });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(400).json({ error: 'Error creating user' });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user by ID:', err);
        res.status(500).json({ error: 'Server error while fetching user' });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(400).json({ error: 'Error updating user' });
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Server error while deleting user' });
    }
});

// Upload Avatar Route
router.post('/:id/upload-avatar', authMiddleware(0), uploadAvatar.single('avatar'), async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify the user's own account
        if (user._id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You do not have permission to update this profile' });
        }

        // Define the path for the resized image
        const imageName = `${userId}-avatar.png`;
        const imagePath = path.join(__dirname, '../assets/avatars/', imageName);

        // Resize and save the image directly with sharp
        await sharp(req.file.path)
            .rotate()
            .resize(150, 150)
            .toFile(imagePath);

        // Update user with the URL of the avatar
        user.avatarUrl = `/assets/avatars/${imageName}`;
        await user.save();

        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting original file:', err);
        });

        res.status(200).json({ message: 'Avatar uploaded successfully', avatarUrl: user.avatarUrl });
    } catch (err) {
        console.error('Error uploading avatar:', err);
        res.status(500).json({ error: 'Error uploading avatar' });
    }
});

module.exports = router;