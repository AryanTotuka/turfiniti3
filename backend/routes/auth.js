const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const auth = require('../middleware/auth');
const axios = require('axios');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      phone,
      role: role || 'player'
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message, stack: err.stack });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/me
// @desc    Get user data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/auth/me
// @desc    Update user profile
// @access  Private
router.put('/me', auth, async (req, res) => {
  const { name, phone } = req.body;

  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/auth/users/:id
// @desc    Get user basic info by ID
// @access  Public
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name role createdAt email phone');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth flow
// @access  Public
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed` }),
  (req, res) => {
    const payload = {
      user: {
        id: req.user.id,
        role: req.user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) {
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
        }
        res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
      }
    );
  }
);

// @route   POST /api/auth/send-otp
// @desc    Send OTP to a phone number
// @access  Public
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ msg: 'Phone number is required' });
  }

  try {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    
    // In a real environment with actual keys, this would call the MSG91 API.
    if (!authKey || authKey.includes('your_msg91_auth_key') || process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
        // MOCK OTP FOR DEVELOPMENT/TESTING
        console.log(`[DEV MODE] OTP requested for ${phone}. Use '1234' to verify.`);
        return res.json({ msg: 'OTP sent successfully (Mock mode)' });
    }

    const response = await axios.get(`https://control.msg91.com/api/v5/otp`, {
      params: {
        template_id: templateId,
        mobile: phone,
        authkey: authKey,
      }
    });

    if (response.data.type === 'success') {
      res.json({ msg: 'OTP sent successfully' });
    } else {
      res.status(400).json({ msg: 'Failed to send OTP', error: response.data.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while sending OTP' });
  }
});

// @route   POST /api/auth/verify-otp-login
// @desc    Verify OTP and login user
// @access  Public
router.post('/verify-otp-login', async (req, res) => {
  const { phone, otp } = req.body;
  
  if (!phone || !otp) {
    return res.status(400).json({ msg: 'Phone and OTP are required' });
  }

  try {
    const authKey = process.env.MSG91_AUTH_KEY;

    // Verify logic
    let isOtpValid = false;
    
    // Mock check
    if (!authKey || authKey.includes('your_msg91_auth_key') || process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
        isOtpValid = (otp === '1234');
        if (!isOtpValid) return res.status(400).json({ msg: 'Invalid OTP' });
    } else {
        const response = await axios.post(`https://control.msg91.com/api/v5/otp/verify`, null, {
            params: {
                otp,
                mobile: phone,
                authkey: authKey,
            }
        });
        if (response.data.type === 'error') {
            return res.status(400).json({ msg: 'Invalid OTP' });
        }
        isOtpValid = true;
    }

    if (isOtpValid) {
        let user = await User.findOne({ phone });
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found. Please sign up first.' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
            }
        );
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while verifying OTP' });
  }
});

// @route   POST /api/auth/verify-otp-signup
// @desc    Verify OTP and register user
// @access  Public
router.post('/verify-otp-signup', async (req, res) => {
  const { name, email, phone, role, password, otp } = req.body;
  
  if (!phone || !otp || !name || !email) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    // Check if user already exists
    let userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
        return res.status(400).json({ msg: 'User with this email or phone already exists' });
    }

    const authKey = process.env.MSG91_AUTH_KEY;
    let isOtpValid = false;
    
    // Mock check
    if (!authKey || authKey.includes('your_msg91_auth_key') || process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
        isOtpValid = (otp === '1234');
        if (!isOtpValid) return res.status(400).json({ msg: 'Invalid OTP' });
    } else {
        const response = await axios.post(`https://control.msg91.com/api/v5/otp/verify`, null, {
            params: {
                otp,
                mobile: phone,
                authkey: authKey,
            }
        });
        if (response.data.type === 'error') {
            return res.status(400).json({ msg: 'Invalid OTP' });
        }
        isOtpValid = true;
    }

    if (isOtpValid) {
        const user = new User({
            name,
            email,
            password: password || undefined, // Password is optional with OTP but we might pass it
            phone,
            role: role || 'player'
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
            }
        );
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while verifying OTP' });
  }
});

module.exports = router;
