import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ search, setSearch }) => {
  const location = useLocation();

  return (
    <>
      <nav className="bg-white border-b border-dachriRed shadow flex flex-col md:flex-row md:items-center md:justify-between px-2 sm:px-6 py-3 mb-8 fixed top-0 left-0 w-full z-50">
        <div className="flex flex-col sm:flex-row items-center w-full gap-2 sm:gap-0">
          {/* Logo and site name */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo.jpeg"
              alt="DACHRI Shoes Logo"
              className="w-12 h-12 rounded-full border-2 border-dachriRed bg-white"
            />
            <span className="text-2xl font-extrabold text-dachriNavy tracking-tight">
              DACHRI SHOES
            </span>
          </div>
          {/* Search bar (always visible) */}
          <input
            type="text"
            placeholder="Search by brand, model, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="my-2 sm:my-0 mx-0 sm:mx-8 flex-1 max-w-xs sm:max-w-md px-3 py-2 border border-dachriRed rounded-full focus:outline-none focus:ring-2 focus:ring-dachriRed bg-white text-dachriNavy placeholder-gray-400 shadow text-sm sm:text-base"
            style={{ minWidth: 120 }}
          />
          {/* Navigation links */}
          <div className="flex space-x-6 ml-auto">
            <Link
              to="/"
              className="text-dachriNavy font-semibold hover:text-dachriRed transition"
            >
              Home
            </Link>
            <a
              href="#products"
              className="text-dachriNavy font-semibold hover:text-dachriRed transition"
            >
              Products
            </a>
            <Link
              to="/admin"
              className="text-dachriNavy font-semibold hover:text-dachriRed transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>
      <div className="w-full px-2 md:px-8 pt-[72px]">
        {/* ...rest of your content... */}
      </div>
    </>
  );
};

export default Navbar;