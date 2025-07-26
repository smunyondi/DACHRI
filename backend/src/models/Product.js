const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  stock: { type: Number, required: true },
  sku: { type: String, required: true } // Removed unique: true
});

const productSchema = new mongoose.Schema({
    photo: { type: String }, // Store filename or URL
    brand: { type: String, required: true },
    model_name: { type: String, required: true },
    gender: { type: String },
    category: { type: String },
    width: { type: String },
    material: { type: String },
    price: { type: Number, required: true },
    variants: [variantSchema],
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);