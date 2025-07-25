import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Admin from "../pages/Admin"; // Import Admin page
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/admin" element={<Admin />} /> {/* Admin route */}
    <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
    <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
    <Route path="/orders" element={<Orders />} />
  </Routes>
);

export default AppRoutes;