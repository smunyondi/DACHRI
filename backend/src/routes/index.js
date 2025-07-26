const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllProducts, addProduct, updateProduct, deleteProduct, getProductById } = require('../controllers/productsController');
const { getAllUsers, getUserCount, toggleBlockUser } = require('../controllers/userController');
const { getStats } = require('../controllers/statsController');
const { getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { logout } = require('../controllers/authController');
const { getCart, addToCart, removeFromCart, updateCartItem, clearCart } = require('../controllers/cartController');

// console.log('Imported product controller:', { getAllProducts, addProduct, updateProduct, deleteProduct, getProductById });
// console.log('Imported user controller:', { getAllUsers, getUserCount, toggleBlockUser });
// console.log('auth middleware:', authMiddleware);
// console.log('upload.single:', multer({ storage: multer.diskStorage({ destination: (req, file, cb) => cb(null, 'uploads/'), filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)) }) }).single);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// POST route with file upload (protected)
router.post('/products', authMiddleware, upload.single('photo'), addProduct);

router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
// Update and delete routes protected
router.put('/products/:id', authMiddleware, upload.single('photo'), updateProduct);
router.delete('/products/:id', authMiddleware, deleteProduct);

// User management routes
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/users/count', authMiddleware, adminMiddleware, getUserCount);
router.patch('/users/:id/block', authMiddleware, adminMiddleware, toggleBlockUser);

// Dashboard stats route
router.get('/stats', authMiddleware, adminMiddleware, getStats);

// Order management routes
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);
router.put('/orders/:id', authMiddleware, adminMiddleware, updateOrderStatus);
router.delete('/orders/:id', authMiddleware, adminMiddleware, deleteOrder);

// Create order
router.post('/orders', authMiddleware, async (req, res) => {
  try {
    const { user, products, total, address } = req.body;
    const Order = require('../models/Order');
    const order = new Order({ user, products, total, address, status: 'pending' });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Cart routes
router.get('/cart', authMiddleware, getCart);
router.post('/cart', authMiddleware, addToCart);
router.put('/cart', authMiddleware, updateCartItem);
router.delete('/cart', authMiddleware, removeFromCart);
router.post('/cart/clear', authMiddleware, clearCart);

// Test route
router.post('/test', (req, res) => res.send('Test OK'));

// Logout route
router.post('/auth/logout', authMiddleware, logout);

// Heartbeat endpoint to update lastActive for logged-in users
router.get('/auth/ping', authMiddleware, (req, res) => {
  res.json({ ok: true });
});

module.exports = router;