const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, phone, isAdmin: email === 'dachri@gmail.com' });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    user.online = true; // Mark user as online on login
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (user) {
      user.online = false; // Mark user as offline on logout
      await user.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed', details: err.message });
  }
};
