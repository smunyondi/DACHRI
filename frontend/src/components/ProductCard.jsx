import React from "react";

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    {product.photo && (
      <img
        src={`http://localhost:5000/uploads/${product.photo}`}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
    )}
    <div className="p-4">
      <h2 className="font-bold text-xl mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-lg font-semibold text-blue-600 mb-2">${product.price}</p>
      {/* Add rating, comments, or buttons here */}
    </div>
  </div>
);

export default ProductCard;