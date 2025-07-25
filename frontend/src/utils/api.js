import axios from "axios";

const API_BASE = "http://localhost:5000";

export const fetchProducts = async () => {
    const res = await axios.get(`${API_BASE}/api/products`);
    return Array.isArray(res.data) ? res.data : res.data.products || [];
};

export const addProduct = async (product) => {
    const res = await axios.post(`${API_BASE}/api/products`, product);
    return res.data;
};

export const updateProduct = async (id, product) => {
    const res = await axios.put(`${API_BASE}/api/products/${id}`, product);
    return res.data;
};

export const deleteProduct = async (id) => {
    const res = await axios.delete(`${API_BASE}/api/products/${id}`);
    return res.data;
};

export const registerUser = async (form) => {
  const res = await axios.post(`${API_BASE}/api/auth/register`, form);
  return res.data;
};

export const loginUser = async (form) => {
  const res = await axios.post(`${API_BASE}/api/auth/login`, form);
  return res.data;
};

export const fetchStats = async (token) => {
  const res = await axios.get(`${API_BASE}/api/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const fetchUsers = async (token) => {
  const res = await axios.get(`${API_BASE}/api/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const blockUser = async (id, token) => {
  const res = await axios.patch(`${API_BASE}/api/users/${id}/block`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const unblockUser = async (id, token) => {
  const res = await axios.patch(`${API_BASE}/api/users/${id}/unblock`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const fetchOrders = async (token) => {
  const res = await axios.get(`${API_BASE}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateOrderStatus = async (id, status, token) => {
  const res = await axios.put(`${API_BASE}/api/orders/${id}`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteOrder = async (id, token) => {
  const res = await axios.delete(`${API_BASE}/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createOrder = async (order, token) => {
  const res = await axios.post(`${API_BASE}/api/orders`, order, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const fetchCart = async (token) => {
  const res = await axios.get(`${API_BASE}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addToCart = async (productId, quantity, token) => {
  const res = await axios.post(`${API_BASE}/api/cart`, { productId, quantity }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateCartItem = async (productId, quantity, token) => {
  const res = await axios.put(`${API_BASE}/api/cart`, { productId, quantity }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const removeFromCart = async (productId, token) => {
  const res = await axios.delete(`${API_BASE}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { productId }
  });
  return res.data;
};

export const clearCart = async (token) => {
  const res = await axios.post(`${API_BASE}/api/cart/clear`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};