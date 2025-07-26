import React, { useEffect, useState } from "react";
import { fetchOrders } from "../utils/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchOrders(token).then(setOrders);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order._id} className="border-b py-2">
            <div>
              <b>Order ID:</b> {order._id}<br />
              <b>Total:</b> KES {Number(order.total).toLocaleString('en-KE', { style: 'decimal', maximumFractionDigits: 2 })}<br />
              <b>Status:</b> {order.status}<br />
              <b>Shipping Address:</b> {order.address || "-"}<br />
              <b>Products:</b>
              <ul className="ml-4">
                {order.products.map((p, idx) => (
                  <li key={idx}>
                    {p.product?.brand} {p.product?.model_name} x{p.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
