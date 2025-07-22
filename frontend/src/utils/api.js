import axios from "axios";

export const fetchProducts = async () => {
    const res = await axios.get("/api/products");
    return Array.isArray(res.data) ? res.data : res.data.products || [];
};

export const addProduct = async (product) => {
    const res = await axios.post("/api/products", product);
    return res.data;
};

export const updateProduct = async (id, product) => {
    const res = await axios.put(`/api/products/${id}`, product);
    return res.data;
};

export const deleteProduct = async (id) => {
    const res = await axios.delete(`/api/products/${id}`);
    return res.data;
};