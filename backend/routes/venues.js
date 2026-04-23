const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');

const auth = require('../middleware/auth'); // Use auth if you want to protect owner routes, but for now we'll allow it if they send a token.

// @route   GET /api/venues
// @desc    Get all venues
// @access  Public
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });
    res.json(venues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/venues/:id
// @desc    Get venue by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ msg: 'Venue not found' });
    }
    res.json(venue);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Venue not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/venues
// @desc    Create a new venue
// @access  Private (Owner/Admin)
router.post('/', async (req, res) => { // Consider adding 'auth' middleware here
  try {
    const newVenue = new Venue(req.body);
    const venue = await newVenue.save();
    res.json(venue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/venues/:id
// @desc    Update a venue
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ msg: 'Venue not found' });

    venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(venue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/venues/:id
// @desc    Delete a venue
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ msg: 'Venue not found' });

    await venue.deleteOne();
    res.json({ msg: 'Venue removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
