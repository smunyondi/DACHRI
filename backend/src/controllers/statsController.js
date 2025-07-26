const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getStats = async (req, res) => {
  try {
    // Only allow admin users to access stats
    if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });
    const adminUser = await User.findById(req.userId);
    if (!adminUser || !adminUser.isAdmin) return res.status(403).json({ error: 'Forbidden: Admins only' });

    const registeredUserCount = await User.countDocuments();
    // Use a 10-second window for online users
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const onlineUserCount = await User.countDocuments({ lastActive: { $gte: tenSecondsAgo } });
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    res.json({ registeredUserCount, onlineUserCount, productCount, orderCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
