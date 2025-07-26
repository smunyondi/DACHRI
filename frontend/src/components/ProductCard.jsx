import React, { useState } from "react";
import AuthModal from "./AuthModal";
import { FaShoppingCart } from "react-icons/fa";
import ProductDetailsModal from "./ProductDetailsModal";

const ProductCard = ({ product, onAddToCart }) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Only navigate after successful login in this session
  const handleLoginSuccess = () => {
    setAuthOpen(false);
    setModalOpen(true);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const isAuthenticated = !!localStorage.getItem("token");
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setModalOpen(true);
  };

  const handleAuthClose = () => {
    setAuthOpen(false);
  };

  const handleCardClick = (e) => {
    // Prevent navigation if add to cart button is clicked
    if (e.target.closest("button")) return;
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
  };

  const handleAddToCartFromModal = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity, selectedColor, selectedSize);
    }
    handleModalClose();
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 relative cursor-pointer group hover:shadow-2xl hover:scale-105 hover:border-dachriRed border-2 border-transparent"
      style={{ minHeight: 320 }}
      onClick={handleCardClick}
    >
      {product.photo && (
        <img
          src={`http://localhost:5000/uploads/${product.photo}`}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-300"
        />
      )}
      <div className="absolute left-4 bottom-4 flex flex-col justify-end w-2/3 bg-white bg-opacity-80 rounded p-2 group-hover:bg-opacity-100 group-hover:shadow-lg transition-all duration-300">
        <h2 className="font-bold text-xl mb-1 text-dachriNavy truncate group-hover:text-dachriRed transition-colors duration-300">{product.model_name}</h2>
        <p className="text-lg font-semibold text-dachriRed group-hover:text-dachriNavy transition-colors duration-300">
          KES {Number(product.price).toLocaleString('en-KE', { style: 'decimal', maximumFractionDigits: 2 })}
        </p>
      </div>
      <button
        className="bg-dachriRed text-white px-4 py-2 rounded hover:bg-dachriNavy flex items-center gap-2 transition absolute right-4 bottom-4 shadow group-hover:scale-110 group-hover:z-10"
        onClick={handleAddToCart}
        title={!localStorage.getItem("token") ? 'Login to add products to cart' : 'Select variant & add to cart'}
      >
        <FaShoppingCart />
      </button>
      <AuthModal
        isOpen={authOpen}
        onClose={handleAuthClose}
        onLoginSuccess={handleLoginSuccess}
        modalContainerProps={{ onClick: e => e.stopPropagation() }}
      />
      <ProductDetailsModal
        product={product}
        isOpen={modalOpen}
        onClose={handleModalClose}
        onAddToCart={handleAddToCartFromModal}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        quantity={quantity}
        setQuantity={setQuantity}
      />
    </div>
  );
};

export default ProductCard;