const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Use only inclusion projection (no -password)
    const users = await User.find().select('username email isAdmin blocked online lastActive');
    // For backward compatibility, also set online=true if lastActive is within 2 seconds
    const now = Date.now();
    const usersWithLastActive = users.map(u => {
      const user = u.toObject();
      user.lastActive = user.lastActive || null;
      user.online = user.lastActive && (now - new Date(user.lastActive).getTime() < 2000);
      return user;
    });
    res.json(usersWithLastActive);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user count
exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user count' });
  }
};

// Block/unblock user
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.blocked = !user.blocked;
    await user.save();
    res.json({ success: true, blocked: user.blocked });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user block status' });
  }
};
