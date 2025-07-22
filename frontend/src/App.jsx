import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";
import "./App.css";

const App = () => {
  const [search, setSearch] = useState("");

  return (
    <Router>
      <div className="min-h-screen bg-dachriOff">
        <Navbar search={search} setSearch={setSearch} />
        <Routes>
          <Route path="/" element={<Home search={search} setSearch={setSearch} />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;