import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { addToCart } from "../utils/api";
import Notification from "../components/Notification";
import { FaShoppingCart } from "react-icons/fa";

const ProductDetails = ({ cart, setCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "success" });

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(res => {
      setProduct(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotification({ message: "Please login to add to cart.", type: "error" });
      return;
    }
    try {
      const updatedCart = await addToCart(product._id, 1, token);
      setCart && setCart(updatedCart.items || []);
      setNotification({ message: `${product.model_name} added to cart!`, type: "success" });
    } catch (err) {
      setNotification({ message: "Failed to add to cart.", type: "error" });
    }
  };

  const handleNotificationClose = () => setNotification({ message: "", type: "success" });

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (!product) return <div className="text-center mt-10 text-red-500">Product not found.</div>;

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
      <Link to="/" className="mb-6 text-blue-600 hover:underline">&larr; Back to Home</Link>
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row items-center max-w-3xl w-full">
        {product.photo && (
          <img
            src={`http://localhost:5000/uploads/${product.photo}`}
            alt={product.model_name}
            className="rounded-lg mb-6 md:mb-0 md:mr-8 w-64 h-64 object-cover border"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.brand} {product.model_name}</h1>
          <div className="text-blue-700 font-semibold text-2xl mb-4">${product.price}</div>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </div>
          <ul className="mb-4 space-y-1">
            <li><b>SKU:</b> {product.sku_code}</li>
            <li><b>Gender:</b> {product.gender}</li>
            <li><b>Category:</b> {product.category}</li>
            <li><b>Colorway:</b> {product.colorway}</li>
            <li><b>Size:</b> {product.size}</li>
            <li><b>Width:</b> {product.width}</li>
            <li><b>Material:</b> {product.material}</li>
          </ul>
          <button
            className="bg-dachriRed text-white px-6 py-3 rounded hover:bg-dachriNavy font-bold text-lg shadow transition flex items-center gap-2"
            onClick={handleAddToCart}
            title={!localStorage.getItem("token") ? 'Login to add products to cart' : 'Add to cart'}
          >
            <FaShoppingCart className="text-xl" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;