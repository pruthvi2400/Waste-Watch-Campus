const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
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
  res.status(200).json({
    success: true,
    message: 'Waste Watch Campus API is running...'
  });
});

// 404 Not Found handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
