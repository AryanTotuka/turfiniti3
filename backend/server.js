const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars BEFORE passport config
dotenv.config();

const passport = require('./config/passport');

const app = express();
app.set('trust proxy', 1);

// ---------------------
// CORS
// ---------------------

const corsOptions = {
  origin: ['https://turfiniti.netlify.app', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// ---------------------
// Middleware
// ---------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ---------------------
// Health Routes
// ---------------------

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Turfiniti API",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ---------------------
// API Routes
// ---------------------

app.use("/api/auth", require("./routes/auth"));
app.use("/api/venues", require("./routes/venues"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/partners", require("./routes/partners"));
app.use("/api/email", require("./routes/email"));

// ---------------------
// 404 Handler
// ---------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ---------------------
// Global Error Handler
// ---------------------

app.use((err, req, res, next) => {
  console.error("========== ERROR ==========");
  console.error(err);
  console.error("===========================");

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ---------------------
// Database Connection
// ---------------------

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
