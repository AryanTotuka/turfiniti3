const express = require('express');
const router = express.Router();

// @route   POST /api/email/send-booking-confirmation
// @desc    Send booking confirmation email via EmailJS
// @access  Public
router.post('/send-booking-confirmation', async (req, res) => {
  const { userName, userEmail, venueName, date, slots, totalPrice, bookingId } = req.body;

  if (!userEmail) {
    return res.status(400).json({ success: false, message: 'Recipient email is required' });
  }

  try {
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("Missing EmailJS credentials in backend environment");
      return res.status(500).json({ success: false, message: 'Email service configuration error' });
    }

    const templateParams = {
      to_name: userName,
      to_email: userEmail,
      venue_name: venueName,
      date: date,
      slots: Array.isArray(slots) ? slots.join(', ') : slots,
      total_price: totalPrice,
      booking_id: bookingId,
      reply_to: 'turfinity25@gmail.com'
    };

    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: templateParams
    };

    if (privateKey) {
      payload.accessToken = privateKey;
    }

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('EmailJS API error response:', errorText);
      return res.status(response.status).json({ success: false, message: 'Failed to send email via provider', error: errorText });
    }

    const resText = await response.text();
    console.log('Email sent successfully via EmailJS:', resText);
    return res.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('Failed to send email:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
