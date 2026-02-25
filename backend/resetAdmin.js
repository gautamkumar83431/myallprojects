const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Delete existing admin if exists
    await User.deleteOne({ email: 'admin@example.com' });
    console.log('Existing admin deleted (if any)');
    
    // Admin credentials
    const adminData = {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      phone: '1234567890',
      address: 'Admin Office',
      role: 'admin',
      isAdmin: true
    };
    
    // Create admin user
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      phone: adminData.phone,
      address: adminData.address,
      role: adminData.role,
      isAdmin: adminData.isAdmin
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Name:', adminData.name);
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('Role:', adminData.role);
    console.log('\nUse these credentials on Admin Login page');
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
