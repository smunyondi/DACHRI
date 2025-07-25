import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../utils/api";

const Checkout = ({ cart, setCart }) => {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (!address) {
      setMessage("Please enter a shipping address.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const orderData = {
        user: user.id,
        products: cart.map(item => ({ product: item._id, quantity: item.quantity })),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        address,
      };
      await createOrder(orderData, token);
      setCart([]);
      setMessage("Order placed successfully!");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      setMessage("Failed to place order.");
      console.error("Order error:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Shipping Address</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Enter your shipping address"
        />
      </div>
      <button className="bg-green-600 text-white px-6 py-2 rounded" onClick={handleOrder}>
        Place Order
      </button>
      {message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  );
};

export default Checkout;
