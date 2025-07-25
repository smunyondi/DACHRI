import React, { useState } from "react";
import { registerUser } from "../utils/api";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", phone: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      setMessage("Registration successful! Please login.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="w-full mx-auto p-0">
      <h2 className="text-2xl font-extrabold mb-6 text-dachriNavy text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} required className="w-full p-3 border-2 border-dachriRed rounded-full focus:outline-none focus:ring-2 focus:ring-dachriRed text-dachriNavy placeholder-gray-400 shadow" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full p-3 border-2 border-dachriRed rounded-full focus:outline-none focus:ring-2 focus:ring-dachriRed text-dachriNavy placeholder-gray-400 shadow" />
        <input name="phone" type="text" placeholder="Phone (+country code)" value={form.phone} onChange={handleChange} required className="w-full p-3 border-2 border-dachriRed rounded-full focus:outline-none focus:ring-2 focus:ring-dachriRed text-dachriNavy placeholder-gray-400 shadow" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full p-3 border-2 border-dachriRed rounded-full focus:outline-none focus:ring-2 focus:ring-dachriRed text-dachriNavy placeholder-gray-400 shadow" />
        <button type="submit" className="w-full bg-dachriRed text-white py-3 rounded-full font-bold shadow hover:bg-dachriNavy transition">Register</button>
      </form>
      {message && (
        <div className={`mt-4 text-center font-semibold ${message.includes('successful') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>
      )}
    </div>
  );
};

export default Register;
