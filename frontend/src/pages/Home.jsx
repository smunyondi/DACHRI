import React, { useEffect, useState, useRef } from "react";
import { fetchProducts, addToCart } from "../utils/api";
import ProductCard from "../components/ProductCard";
import Notification from "../components/Notification";
import { Link } from "react-router-dom";

const getCartKey = (userId) => userId ? `cart_${userId}` : "cart_guest";

const Home = ({ search, cart, setCart, userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const productsRef = useRef(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // Scroll to products when search changes and is not empty
  useEffect(() => {
    if (search.trim() !== "" && productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [search]);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const updatedCart = await addToCart(product._id, 1, token);
      setCart(updatedCart.items || []);
      setNotification({ message: `${product.model_name} added to cart!`, type: "success" });
    } catch (err) {
      setNotification({ message: "Failed to add to cart.", type: "error" });
    }
  };

  const handleNotificationClose = () => setNotification({ message: "", type: "success" });

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  // Filter products by search and in stock
  const filteredProducts = products.filter((product) => {
    if (search.trim() === "") {
      // No search: show only in-stock
      return product.stock > 0;
    }
    // With search: show all matching products, regardless of stock
    return (
      product.brand?.toLowerCase().includes(search.toLowerCase()) ||
      product.model_name?.toLowerCase().includes(search.toLowerCase()) ||
      product.category?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="w-full px-2 md:px-8 pt-28 md:pt-20">
      <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
      {/* Hero Section */}
      <section
        className="bg-dachriOff rounded-xl shadow-lg mb-8 p-4 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ border: "4px solid #fde4e4" }} // faded red
      >
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-dachriNavy mb-3 sm:mb-4 drop-shadow-lg">
            Welcome to <span className="text-dachriRed">DACHRI SHOES</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-dachriNavy mb-4">
            Discover the latest and greatest in footwear. Shop top brands, exclusive models, and find your perfect fit for every occasion!
          </p>
          <a
            href="#products"
            className="inline-block bg-dachriRed hover:bg-red-500 text-white font-bold px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow transition text-base sm:text-lg"
          >
            Shop Now
          </a>
        </div>
        <div className="flex-1 flex justify-center mt-6 md:mt-0">
          <img
            src="/logo.jpeg"
            alt="DACHRI Shoes Logo"
            className="w-40 h-40 sm:w-60 sm:h-60 object-cover rounded-xl shadow-2xl bg-white"
            style={{
              background: "#fff",
              border: "4px solid #fde4e4" // faded red border
            }}
          />
        </div>
      </section>

      <h1
        id="products"
        ref={productsRef}
        className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-dachriNavy tracking-tight bg-dachriOff/80 rounded-lg py-4 shadow border border-dachriRed/20 mx-auto max-w-xl"
      >
        <span className="inline-block align-middle">
          <svg className="inline-block w-8 h-8 mr-2 text-dachriRed" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 3.13a4 4 0 01.94 7.87M8 3.13a4 4 0 00-.94 7.87" />
          </svg>
          Available Shoes
        </span>
      </h1>

      <section
        className="bg-dachriOff/80 rounded-xl shadow-md mb-10 px-6 py-8 flex items-center justify-center border border-dachriRed/30"
      >
        <span className="flex items-center gap-4 text-lg md:text-xl text-dachriNavy font-semibold text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dachriRed" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 3.13a4 4 0 01.94 7.87M8 3.13a4 4 0 00-.94 7.87" />
          </svg>
          Welcome to our collection of quality shoes. You will find your favorite Shoe.
        </span>
      </section>

      <div className="w-full px-2 md:px-8">
        <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;