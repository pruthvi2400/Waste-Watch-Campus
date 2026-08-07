const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const campusRoutes = require('./routes/campusRoutes');
const reportRoutes = require('./routes/reportRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().then(() => {
  // Seed Database on startup
  const seedData = require('./utils/seeder');
  seedData();
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campus', campusRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Waste Watch Campus API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
