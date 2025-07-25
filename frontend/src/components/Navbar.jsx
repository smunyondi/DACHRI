import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = ({ search, setSearch, cart, userId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem("cart", JSON.stringify([])); // Clear UI cart on logout
    setIsAuthenticated(false);
    navigate("/");
  };

  // Only show Admin button if on /admin route
  const showAdmin = location.pathname === "/admin";

  // Cart count
  const cartCount = cart?.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Get username from localStorage user object
  let username = null;
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    username = user && user.username ? user.username : null;
  } catch {}

  return (
    <>
      <nav className="bg-white border-b border-dachriRed shadow-lg flex flex-col md:flex-row md:items-center md:justify-between px-2 sm:px-6 py-3 mb-8 fixed top-0 left-0 w-full z-50">
        <div className="flex flex-col sm:flex-row items-center w-full gap-2 sm:gap-0">
          {/* Logo and site name */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo.jpeg"
              alt="DACHRI Shoes Logo"
              className="w-12 h-12 rounded-full border-2 border-dachriRed bg-white shadow-md"
            />
            <span className="text-2xl font-extrabold text-dachriNavy tracking-tight">
              DACHRI SHOES
            </span>
          </div>
          {/* Greeting message */}
          {isAuthenticated && username && (
            <span className="ml-4 text-dachriNavy font-semibold text-lg">Hello, {username}!</span>
          )}
          {/* Search bar (always visible) */}
          <input
            type="text"
            placeholder="Search by brand, model, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="my-2 sm:my-0 mx-0 sm:mx-8 flex-1 max-w-xs sm:max-w-md px-3 py-2 border-2 border-dachriRed rounded-full focus:outline-none focus:ring-2 focus:ring-dachriRed bg-white text-dachriNavy placeholder-gray-400 shadow text-sm sm:text-base transition"
            style={{ minWidth: 120 }}
          />
          {/* Navigation links */}
          <div className="flex space-x-6 ml-auto items-center">
            <Link
              to="/"
              className="text-dachriNavy font-semibold hover:text-dachriRed transition duration-150"
            >
              Home
            </Link>
            <a
              href="#products"
              className="text-dachriNavy font-semibold hover:text-dachriRed transition duration-150"
            >
              Products
            </a>
            {/* Cart icon with count */}
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-dachriNavy hover:text-dachriRed text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-dachriRed text-white rounded-full px-2 py-0.5 text-xs font-bold shadow-lg animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
            {showAdmin && (
              <Link
                to="/admin"
                className="text-dachriNavy font-semibold hover:text-dachriRed transition duration-150"
              >
                Admin
              </Link>
            )}
            {!isAuthenticated ? (
              <>
                <button
                  className="text-blue-600 font-semibold hover:text-dachriRed transition"
                  onClick={() => setAuthOpen(true)}
                >
                  Login / Register
                </button>
              </>
            ) : (
              <button
                className="text-red-600 font-semibold hover:text-dachriNavy transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      <AuthModal isOpen={authOpen} onClose={() => { setAuthOpen(false); setIsAuthenticated(!!localStorage.getItem("token")); }} />
      <div className="w-full px-2 md:px-8 pt-[72px]">
        {/* ...rest of your content... */}
      </div>
    </>
  );
};

export default Navbar;