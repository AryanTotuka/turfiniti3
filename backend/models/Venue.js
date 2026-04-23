const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String },
  description: String,
  pricePerHour: { type: Number, default: 0 },
  sports: [{
    type: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  images: [String],
  facilities: [String],
  openTime: String,
  closeTime: String,
  maxCapacity: Number,
  durationPerSlot: { type: Number, default: 30 },
  rules: [String],
  mapEmbedUrl: String,
  allowOnlinePayment: { type: Boolean, default: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contactName: String,
  contactNumber: String,
  ratings: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venue', venueSchema);
