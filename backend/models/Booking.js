const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  venueName: { type: String, required: true },
  date: { type: String, required: true },
  slots: { type: [String], required: true },
  totalPrice: { type: Number, required: true },
  sport: { type: String, default: 'General' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String },
  userPhone: { type: String },
  paymentMethod: { type: String },
  status: { type: String, default: 'confirmed' },
  bookingDisplayId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
