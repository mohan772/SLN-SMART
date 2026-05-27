const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const setupAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email: 'admin@sln.com' },
        { username: 'admin' }
      ]
    });
    
    if (user) {
      user.role = 'admin';
      user.username = 'admin';
      user.password = 'password123'; // Explicitly reset to ensure it matches
      user.isVerified = true;
      await user.save();
      console.log('Admin user updated. Username: admin, Password: password123');
    } else {
      user = await User.create({
        username: 'admin',
        name: 'Super Admin',
        email: 'admin@sln.com',
        password: 'password123',
        role: 'admin',
        isVerified: true
      });
      console.log('Created new admin user. Username: admin, Password: password123');
    }
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

setupAdmin();
