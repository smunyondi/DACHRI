import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import { fetchCart } from "./utils/api";
import "./App.css";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) return user._id;
    // Fallback: decode userId from JWT if user is missing
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload._id || null;
    }
    return null;
  } catch {
    return null;
  }
};

const getToken = () => localStorage.getItem("token");

const App = () => {
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState(getUserId());
  const [cart, setCart] = useState([]);

  // Fetch cart from backend for current user
  useEffect(() => {
    const fetchUserCart = async () => {
      const token = getToken();
      console.log('[DEBUG] useEffect triggered. userId:', userId, 'token:', token);
      if (userId && token) {
        try {
          console.log('[DEBUG] Fetching cart for user:', userId);
          const cartData = await fetchCart(token);
          console.log('[DEBUG] Cart data from backend:', cartData);
          setCart(cartData?.items || []);
        } catch (err) {
          console.error('[DEBUG] Failed to fetch cart:', err);
          setCart([]);
        }
      } else {
        console.log('[DEBUG] No userId or token, setting cart to empty.');
        setCart([]);
      }
    };
    fetchUserCart();
  }, [userId]);

  // Listen for login/logout changes
  useEffect(() => {
    const handleStorage = () => {
      setUserId(getUserId());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-dachriOff">
        <Navbar search={search} setSearch={setSearch} cart={cart} userId={userId} />
        <Routes>
          <Route path="/" element={<Home search={search} setSearch={setSearch} cart={cart} setCart={setCart} userId={userId} />} />
          <Route path="/products/:id" element={<ProductDetails cart={cart} setCart={setCart} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} userId={userId} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;