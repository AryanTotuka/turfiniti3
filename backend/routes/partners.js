const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');

// @route   POST /api/partners
// @desc    Submit a partner request
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, phone, venueName, location } = req.body;

  try {
    const newPartner = new Partner({
      name, email, phone, venueName, location
    });

    const partner = await newPartner.save();
    res.json(partner);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
