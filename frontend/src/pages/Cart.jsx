import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeFromCart, updateCartItem } from "../utils/api";
import Notification from "../components/Notification";

const Cart = ({ cart, setCart, userId }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "success" });

  const token = localStorage.getItem("token");

  const handleRemove = async (id) => {
    try {
      const updatedCart = await removeFromCart(id, token);
      setCart(updatedCart.items || []);
      setNotification({ message: "Product removed from cart!", type: "success" });
    } catch {
      setNotification({ message: "Failed to remove item.", type: "error" });
    }
  };

  const handleQuantityChange = async (id, quantity) => {
    try {
      const updatedCart = await updateCartItem(id, quantity, token);
      setCart(updatedCart.items || []);
    } catch {
      setMessage("Failed to update quantity.");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }
    navigate("/checkout");
  };

  const handleNotificationClose = () => setNotification({ message: "", type: "success" });

  return (
    <div className="container mx-auto p-4">
      <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {message && <div className="text-red-500 mb-2">{message}</div>}
      <ul>
        {cart.map(item => {
          const prod = item.product || {};
          const prodId = prod._id;
          return (
            <li key={item._id} className="border-b py-2 flex justify-between items-center">
              <span>
                <b>{prod.brand || "Unknown Brand"}</b> {prod.model_name || "Unknown Model"} (${prod.price !== undefined ? prod.price : "?"})
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => handleQuantityChange(prodId, parseInt(e.target.value))}
                  className="ml-2 w-16 border rounded px-2"
                />
              </span>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleRemove(prodId)}>
                Remove
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
