const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@minka.com';
    const adminPassword = 'admin123';

    // Check if admin already exists
    let admin = await User.findOne({ email: adminEmail });
    
    if (admin) {
      console.log('Admin user already exists');
      // Check if password needs update
      const isMatch = await bcrypt.compare(adminPassword, admin.password);
      if (!isMatch) {
        admin.password = adminPassword;
        await admin.save();
        console.log('Admin password updated');
      } else {
        console.log('Admin password unchanged');
      }
    } else {
      // Create new admin
      admin = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '+2348000000000'
      });
      await admin.save();
      console.log('Admin user created successfully');
    }
    
    // Verify login works
    const verifyAdmin = await User.findOne({ email: adminEmail }).select('+password');
    const isMatch = await verifyAdmin.matchPassword(adminPassword);
    if (isMatch) {
      console.log('✅ Admin credentials verified!');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log('❌ Admin password verification failed');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();