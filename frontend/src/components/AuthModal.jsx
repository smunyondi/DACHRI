import React, { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AuthModal = ({ isOpen, onClose, isAdminSide, title }) => {
  const [showLogin, setShowLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-dachriRed">
        <button
          className="absolute top-3 right-3 text-dachriRed hover:text-dachriNavy text-2xl font-bold transition"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="mb-6 flex justify-center gap-4">
          <button
            className={`px-6 py-2 rounded-full font-semibold shadow transition-all duration-150 border-2 border-dachriRed ${showLogin ? "bg-dachriRed text-white" : "bg-white text-dachriDachriRed hover:bg-dachriRed hover:text-white"}`}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold shadow transition-all duration-150 border-2 border-dachriRed ${!showLogin ? "bg-dachriRed text-white" : "bg-white text-dachriDachriRed hover:bg-dachriRed hover:text-white"}`}
            onClick={() => setShowLogin(false)}
          >
            Register
          </button>
        </div>
        {showLogin ? <Login onLogin={onClose} isAdminSide={isAdminSide} title={title} /> : <Register />}
      </div>
    </div>
  );
};

export default AuthModal;
