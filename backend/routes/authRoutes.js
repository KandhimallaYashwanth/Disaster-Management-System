const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// POST /api/auth/signup - Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, location } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phone || !role || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if user already exists in database
    console.log(`🔍 Checking if user already exists with email: ${email}`);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`❌ User already exists in database: ${email}`);
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    console.log(`📝 Creating new user: ${firstName} ${lastName} (${email})`);
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      location
    });

    // Save user to database
    await user.save();
    console.log(`✅ User successfully saved to database with ID: ${user._id}`);

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error during registration' 
    });
  }
});

// POST /api/auth/login - Login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find user by email - CHECKING DATABASE
    console.log(`🔍 Checking database for user with email: ${email}`);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User not found in database: ${email}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    console.log(`✅ User found in database: ${user.email}`);

    // Check password
    console.log(`🔐 Verifying password for user: ${user.email}`);
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log(`❌ Invalid password for user: ${user.email}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    console.log(`✅ Password verified successfully for user: ${user.email}`);
    // Generate JWT token
    const token = generateToken(user._id);
    console.log(`🎟️ JWT token generated for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error during login' 
    });
  }
});

module.exports = router;
