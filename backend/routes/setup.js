const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// One-time admin creation endpoint (remove after use)
router.get('/create-admin', async (req, res) => {
  try {
    const exists = await User.findOne({ email: 'gautamkumar83431@gmail.com' });
    if (exists) return res.json({ message: 'Admin already exists' });
    
    const hashedPassword = await bcrypt.hash('admin@83', 10);
    const admin = new User({
      name: 'Admin',
      email: 'gautamkumar83431@gmail.com',
      password: hashedPassword,
      phone: '9123202975',
      address: 'Admin Address',
      role: 'admin',
      isAdmin: true
    });
    
    await admin.save();
    res.json({ message: 'Admin created successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
