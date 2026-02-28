const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    const users = await User.find({});
    console.log('All users in database:');
    users.forEach(user => {
      console.log(`Email: ${user.email}, Role: ${user.role}, isAdmin: ${user.isAdmin}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
