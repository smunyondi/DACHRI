const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart for logged-in user
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      model: 'Product'
    });
    if (!cart) return res.json({ items: [] });
    // Filter out items with missing or unpopulated product
    cart.items = cart.items.filter(item => item.product && item.product._id);
    await cart.save(); // Save cleaned cart if any items were removed
    const items = cart.items.map(item => ({
      ...item.toObject(),
      product: item.product
    }));
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart.' });
  }
};

// Add/update item in cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    // Ensure product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }
    await cart.save();
    // Always re-fetch and populate after save
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    // Filter out any items with missing product
    populatedCart.items = populatedCart.items.filter(item => item.product && item.product._id);
    await populatedCart.save();
    const items = populatedCart.items.map(item => ({ ...item.toObject(), product: item.product }));
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart.' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });
    cart.items = cart.items.filter(item => {
      const id = item.product && item.product._id ? item.product._id.toString() : item.product.toString();
      return id !== productId;
    });
    await cart.save();
    // Always re-fetch and populate after save
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    // Filter out any items with missing product
    populatedCart.items = populatedCart.items.filter(item => item.product && item.product._id);
    await populatedCart.save();
    const items = populatedCart.items.map(item => ({ ...item.toObject(), product: item.product }));
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from cart.' });
  }
};

// Update quantity
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });
    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ error: 'Item not found.' });
    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart item.' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart.' });
  }
};
