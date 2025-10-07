const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/urls', require('./routes/urls'));
app.use('/api/analytics', require('./routes/analytics'));

// Redirect route for shortened URLs
app.get('/:shortCode', require('./routes/redirect'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'URL Shortener API is running' });
});

// MongoDB connection
const connectDB = async () => {
  try {
    // Use a local MongoDB connection for development
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // For demo purposes, we'll continue without MongoDB
    console.log('Continuing without MongoDB - using in-memory storage');
  }
};

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

module.exports = app;
