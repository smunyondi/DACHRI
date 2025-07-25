const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    photo: { type: String }, // Store filename or URL
    brand: { type: String, required: true },
    model_name: { type: String, required: true },
    gender: { type: String },
    category: { type: String },
    colorway: { type: String },
    size: { type: String },
    width: { type: String },
    material: { type: String },
    sku_code: { type: String, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);