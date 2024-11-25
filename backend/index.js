require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// Allow cross-origin requests
app.use(cors({
    origin: 'http://localhost:1234', // UPDATE: Add the frontend URL
    credentials: true,
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Parse the JSON
app.use(express.json());

// Use user routes
app.use('/user', userRoutes);

// Use auth routes
app.use('/auth', authRoutes);

// Event routes
app.use('/events', eventRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});