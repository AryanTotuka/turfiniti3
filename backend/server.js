const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars BEFORE passport config (which needs GOOGLE_CLIENT_ID)
dotenv.config();

const passport = require('./config/passport');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow same-origin requests (no origin header) and configured frontend URLs
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5000',
    ].filter(Boolean);
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(passport.initialize());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes placeholders
app.use('/api/auth', require('./routes/auth'));
app.use('/api/venues', require('./routes/venues'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/partners', require('./routes/partners'));

const path = require('path');
const fs = require('fs');

// Serve static assets if in production / dist folder exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Catch-all route to serve index.html for SPA routing
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Root route placeholder if dist doesn't exist (e.g. in local development)
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Turfiniti API',
      status: 'healthy',
      timestamp: new Date()
    });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


