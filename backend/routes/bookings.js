const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const auth = require('../middleware/auth');

// @route   GET /api/bookings/public
// @desc    Get minimal booking data to calculate availability
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const bookings = await Booking.find({ status: { $ne: 'cancelled' } })
                                  .select('venueId date slots sport status');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error', error: err.message, stack: err.stack });
  }
});

// @route   GET /api/bookings
// @desc    Get bookings for logged in user (or owner)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'owner') {
      // Find venues owned by this owner
      const venues = await Venue.find({ ownerId: req.user.id });
      const venueIds = venues.map(v => v._id);
      
      // Find bookings for these venues
      const bookings = await Booking.find({ venueId: { $in: venueIds } }).sort({ createdAt: -1 });
      return res.json(bookings);
    } else {
      // Find bookings for this player
      const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
      return res.json(bookings);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private (or Public if guest bookings are allowed, but usually private)
router.post('/', async (req, res) => {
  const { 
    venueId, venueName, date, slots, totalPrice, sport, 
    userId, userName, userEmail, userPhone, 
    paymentMethod, bookingDisplayId 
  } = req.body;

  try {
    const newBooking = new Booking({
      venueId, venueName, date, slots, totalPrice, sport,
      userId, userName, userEmail, userPhone,
      paymentMethod, bookingDisplayId
    });

    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check user: must be the player who booked it OR the owner of the venue
    if (req.user.role !== 'owner' && req.user.id !== booking.userId.toString()) {
      return res.status(403).json({ msg: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();
    
    res.json({ msg: 'Booking cancelled' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
