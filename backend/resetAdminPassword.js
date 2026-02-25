const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Your admin email from .env
    const adminEmail = process.env.ADMIN_EMAIL || 'gautamkumar831@gmail.com';
    const newPassword = process.env.ADMIN_PASSWORD || 'admin@83';
    
    // Find and update admin
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log('❌ Admin not found! Creating new admin...');
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '1234567890',
        address: 'Admin Office',
        role: 'admin',
        isAdmin: true
      });
      
      console.log('✅ New admin created!');
    } else {
      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
      await admin.save();
      
      console.log('✅ Admin password updated successfully!');
    }
    
    console.log('\n📧 Admin Email:', adminEmail);
    console.log('🔑 Admin Password:', newPassword);
    console.log('\nUse these credentials to login at /admin/login');
    
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
