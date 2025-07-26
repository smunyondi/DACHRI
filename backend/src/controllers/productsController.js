// Basic product controller template

const Product = require('../models/Product');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err); // Log error to terminal
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// Add a product
const addProduct = async (req, res) => {
    try {
        const {
            brand, model_name, gender, category, width, material, price, variants
        } = req.body;
        const photo = req.file ? req.file.filename : "";
        // Parse variants if sent as JSON string (from multipart/form-data)
        let parsedVariants = variants;
        if (typeof variants === 'string') {
            try {
                parsedVariants = JSON.parse(variants);
            } catch {
                parsedVariants = [];
            }
        }
        // Validate: all variants must have non-null, non-empty, unique sku
        const skuSet = new Set();
        for (const v of parsedVariants) {
            if (!v.sku || typeof v.sku !== 'string' || v.sku.trim() === '') {
                return res.status(400).json({ error: 'Each variant must have a non-empty SKU' });
            }
            if (skuSet.has(v.sku)) {
                return res.status(400).json({ error: 'Duplicate SKU found in variants' });
            }
            skuSet.add(v.sku);
        }
        const product = new Product({
            brand, model_name, gender, category, width, material, price, variants: parsedVariants, photo
        });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err); // Log error to terminal
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
        if (req.body.width !== undefined) updateData.width = req.body.width;
        if (req.body.material !== undefined) updateData.material = req.body.material;
        if (req.body.price !== undefined) updateData.price = req.body.price;
        if (req.body.variants !== undefined) {
            let parsedVariants = req.body.variants;
            if (typeof parsedVariants === 'string') {
                try {
                    parsedVariants = JSON.parse(parsedVariants);
                } catch {
                    parsedVariants = [];
                }
            }
            updateData.variants = parsedVariants;
        }
        if (req.file) updateData.photo = req.file.filename;
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err); // Log error to terminal
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
        console.error(err); // Log error to terminal
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
        console.error(err); // Log error to terminal
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
