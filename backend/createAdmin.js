const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
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
    console.log('Admin created successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
