import React, { useState } from "react";
import { loginUser } from "../utils/api";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "dachri@gmail.com";

const Login = ({ onLogin, isAdminSide, title, onLoginSuccess }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdminSide && form.email !== ADMIN_EMAIL) {
      setMessage("Only admin credentials are allowed.");
      return;
    }
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setMessage("");
      if (onLogin) onLogin(res.user);
      if (onLoginSuccess) onLoginSuccess(res.user);
      // Redirect to admin page if admin credentials are used
      if (res.user.isAdmin) {
        navigate("/admin");
      }
      // On login, switch to user's cart
      const cartKey = `cart_${res.user._id}`;
      let userCart = localStorage.getItem(cartKey);
      if (!userCart) {
        localStorage.setItem(cartKey, JSON.stringify([]));
        userCart = "[]";
      }
      localStorage.setItem("cart", userCart); // Sync current cart state for UI
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="w-full mx-auto p-0">
      {isAdminSide && !title && (
        <div className="w-full text-center py-2 mb-2 bg-dachriRed text-white text-xl font-bold rounded-t-xl shadow">
          Admin Login
        </div>
      )}
      <h2 className="text-2xl font-extrabold mb-6 text-dachriNavy text-center">{title ? title : (!isAdminSide ? "Login" : "")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" placeholder={isAdminSide ? "Admin Email" : "Email"} value={form.email} onChange={handleChange} required className="w-full p-3 border-2 border-dachriRed rounded-full focus:outline-none focus:ring-2 focus:ring-dachriRed text-dachriNavy placeholder-gray-400 shadow" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full p-3 border-2 border-dachriRed rounded-full focus:outline-none focus:ring-2 focus:ring-dachriRed text-dachriNavy placeholder-gray-400 shadow" />
        <button type="submit" className="w-full bg-dachriRed text-white py-3 rounded-full font-bold shadow hover:bg-dachriNavy transition">Login</button>
      </form>
      {message && <div className="mt-4 text-center text-red-500 font-semibold">{message}</div>}
    </div>
  );
};

export default Login;
