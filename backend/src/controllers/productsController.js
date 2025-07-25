// Basic product controller template

const Product = require('../models/Product');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// Add a product
const addProduct = async (req, res) => {
    try {
        const {
            brand, model_name, gender, category, colorway,
            size, width, material, sku_code, price, stock
        } = req.body;
        const photo = req.file ? req.file.filename : "";
        const product = new Product({
            brand, model_name, gender, category, colorway,
            size, width, material, sku_code, price, stock, photo
        });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add product', details: err.message });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};
        if (req.body.brand !== undefined) updateData.brand = req.body.brand;
        if (req.body.model_name !== undefined) updateData.model_name = req.body.model_name;
        if (req.body.gender !== undefined) updateData.gender = req.body.gender;
        if (req.body.category !== undefined) updateData.category = req.body.category;
        if (req.body.colorway !== undefined) updateData.colorway = req.body.colorway;
        if (req.body.size !== undefined) updateData.size = req.body.size;
        if (req.body.width !== undefined) updateData.width = req.body.width;
        if (req.body.material !== undefined) updateData.material = req.body.material;
        if (req.body.sku_code !== undefined) updateData.sku_code = req.body.sku_code;
        if (req.body.price !== undefined) updateData.price = req.body.price;
        if (req.body.stock !== undefined) updateData.stock = req.body.stock;
        if (req.file) updateData.photo = req.file.filename;
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update product', details: err.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

// Get a product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch product', details: err.message });
    }
};

module.exports = {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById
};
