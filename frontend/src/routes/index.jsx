import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Admin from "../pages/Admin"; // Import Admin page

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/admin" element={<Admin />} /> {/* Admin route */}
  </Routes>
);

export default AppRoutes;