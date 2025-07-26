import React from "react";

const ProductDetailsModal = ({ product, isOpen, onClose, onAddToCart, selectedColor, setSelectedColor, selectedSize, setSelectedSize, quantity, setQuantity }) => {
  if (!isOpen || !product) return null;
  const variants = product.variants || [];
  const availableColors = [...new Set(variants.map(v => v.color))];
  const availableSizes = [...new Set(variants.filter(v => v.color === selectedColor).map(v => v.size))];
  const price = product.price;
  const selectedVariant = variants.find(v => v.color === selectedColor && v.size === selectedSize);
  const inStock = selectedVariant ? selectedVariant.stock > 0 : product.stock > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative border-2 border-dachriRed/30" onClick={e => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-dachriRed hover:text-dachriNavy text-3xl font-bold" onClick={onClose}>&times;</button>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col items-center justify-center">
            <img src={product.photo ? `http://localhost:5000/uploads/${product.photo}` : product.imageUrl || product.image || "/logo.jpeg"} alt={product.model_name} className="w-48 h-48 object-contain rounded-xl border border-dachriRed/20 bg-dachriOff mb-2" />
            <div className="text-dachriRed font-bold text-lg mt-2">KES {Number(price).toLocaleString('en-KE', { style: 'decimal', maximumFractionDigits: 2 })}</div>
            {selectedVariant && (
              <div className="text-xs text-gray-500 mt-1">SKU: <b>{selectedVariant.sku}</b> | Stock: <b>{selectedVariant.stock}</b></div>
            )}
            <div className={`mt-2 text-sm font-semibold ${inStock ? 'text-green-600' : 'text-red-500'}`}>{inStock ? 'In Stock' : 'Out of Stock'}</div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="text-2xl font-extrabold text-dachriNavy mb-1">{product.brand} <span className="text-dachriRed">{product.model_name}</span></h2>
            <div className="text-sm text-gray-600 mb-2">Category: <b>{product.category}</b></div>
            {product.description && <div className="mb-2 text-gray-700 text-base">{product.description}</div>}
            <div className="mb-2 flex gap-2 items-center">
              <label className="mr-1 font-semibold">Color:</label>
              <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)} className="border border-dachriRed rounded px-2 py-1 focus:outline-dachriRed">
                <option value="">Select</option>
                {availableColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            <div className="mb-2 flex gap-2 items-center">
              <label className="mr-1 font-semibold">Size:</label>
              <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="border border-dachriRed rounded px-2 py-1 focus:outline-dachriRed" disabled={!selectedColor}>
                <option value="">Select</option>
                {availableSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="mb-2 flex gap-2 items-center">
              <label className="mr-1 font-semibold">Quantity:</label>
              <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="border border-dachriRed rounded px-2 w-16 focus:outline-dachriRed" />
            </div>
            <button className="bg-dachriRed hover:bg-dachriNavy text-white px-4 py-2 rounded-lg font-bold mt-2 transition w-full disabled:opacity-60" onClick={onAddToCart} disabled={!selectedColor || !selectedSize || !inStock}>Add to Cart</button>
            <div className="mt-4 text-xs text-gray-400">All prices in Kenyan Shillings (KES). Please select color and size to see SKU and stock.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
