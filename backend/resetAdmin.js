const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dachri-shoes';

async function resetAdmin() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Delete any existing admin user
  await User.deleteOne({ email: 'dachri@gmail.com' });

  // Create new admin user
  const hashedPassword = await bcrypt.hash('Dav1215', 10);
  const adminUser = new User({
    username: 'admin',
    email: 'dachri@gmail.com',
    password: hashedPassword,
    phone: '+1234567890',
    isAdmin: true
  });

  await adminUser.save();
  console.log('Admin user reset and created successfully.');
  mongoose.disconnect();
}

resetAdmin().catch(err => {
  console.error('Error resetting admin user:', err);
  mongoose.disconnect();
});
