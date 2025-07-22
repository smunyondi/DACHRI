import React, { useRef, useState, useEffect } from "react";
import { fetchProducts, updateProduct, deleteProduct } from "../utils/api";
import axios from "axios";

const initialForm = {
  brand: "",
  model_name: "",
  gender: "",
  category: "",
  colorway: "",
  size: "",
  width: "",
  material: "",
  sku_code: "",
  price: "",
  stock: ""
};

const Admin = () => {
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("add"); // "add" or "edit"
  const [editingProduct, setEditingProduct] = useState(null); // null or product object
  const [showAddPopup, setShowAddPopup] = useState(false);
  const editFormRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [editingProduct]);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (photo) formData.append("photo", photo);

      if (editing) {
        await axios.put(`/api/products/${editing}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Product updated!");
      } else {
        await axios.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Product added!");
      }
      setForm(initialForm);
      setPhoto(null);
      setEditing(null);
      loadProducts();
      setActiveTab("add");
      setShowAddPopup(false); // close popup after add
    } catch {
      setMessage("Error saving product.");
    }
  };

  const handleEdit = (product) => {
    setForm({
      brand: product.brand || "",
      model_name: product.model_name || "",
      gender: product.gender || "",
      category: product.category || "",
      colorway: product.colorway || "",
      size: product.size || "",
      width: product.width || "",
      material: product.material || "",
      sku_code: product.sku_code || "",
      price: product.price || "",
      stock: product.stock || ""
    });
    setEditing(product._id);
    setActiveTab("edit");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await deleteProduct(id);
      setMessage("Product deleted!");
      loadProducts();
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setForm({
      brand: product.brand || "",
      model_name: product.model_name || "",
      gender: product.gender || "",
      category: product.category || "",
      colorway: product.colorway || "",
      size: product.size || "",
      width: product.width || "",
      material: product.material || "",
      sku_code: product.sku_code || "",
      price: product.price || "",
      stock: product.stock || ""
    });
    setPhoto(null);
    setTimeout(() => {
      if (editFormRef.current) {
        editFormRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (photo) formData.append("photo", photo);

      await axios.put(`/api/products/${editingProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Product updated!");
      setEditingProduct(null);
      loadProducts();
    } catch {
      setMessage("Error updating product.");
    }
  };

  // Get the last added product
  const lastProduct = products.length > 0 ? products[products.length - 1] : null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Admin Dashboard</h1>
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold focus:outline-none transition ${
            activeTab === "add"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => {
            setActiveTab("add");
            setEditing(null);
            setForm(initialForm);
            setPhoto(null);
          }}
        >
          Add Product
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold focus:outline-none transition ${
            activeTab === "edit"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => {
            setActiveTab("edit");
            setEditing(null);
            setForm(initialForm);
            setPhoto(null);
          }}
        >
          Edit Product
        </button>
      </div>

      {/* Add Product Popup Trigger */}
      {activeTab === "add" && (
        <div className="flex justify-center mb-8">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
            onClick={() => setShowAddPopup(true)}
          >
            + Add New Product
          </button>
        </div>
      )}

      {/* Add Product Popup Modal */}
      {showAddPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            className="bg-white shadow-2xl rounded-lg px-3 py-4 w-[95vw] max-w-xs sm:max-w-sm md:max-w-md max-h-[40vh] overflow-y-auto relative border"
            style={{ boxSizing: "border-box" }}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={() => setShowAddPopup(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <form
              onSubmit={handleSubmit}
              className="space-y-3"
              encType="multipart/form-data"
            >
              <input className="w-full border p-2 rounded" name="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
              <input className="w-full border p-2 rounded" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />
              <input className="w-full border p-2 rounded" name="model_name" placeholder="Model Name" value={form.model_name} onChange={handleChange} required />
              <input className="w-full border p-2 rounded" name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} />
              <input className="w-full border p-2 rounded" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
              <input className="w-full border p-2 rounded" name="colorway" placeholder="Colorway" value={form.colorway} onChange={handleChange} />
              <input className="w-full border p-2 rounded" name="size" placeholder="Size" value={form.size} onChange={handleChange} />
              <input className="w-full border p-2 rounded" name="width" placeholder="Width" value={form.width} onChange={handleChange} />
              <input className="w-full border p-2 rounded" name="material" placeholder="Material" value={form.material} onChange={handleChange} />
              <input className="w-full border p-2 rounded" name="sku_code" placeholder="SKU Code" value={form.sku_code} onChange={handleChange} required />
              <input className="w-full border p-2 rounded" name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
              <input className="w-full border p-2 rounded" name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
              <div className="flex justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded" type="submit">
                  Add Shoe
                </button>
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:underline"
                  onClick={() => setShowAddPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {message && <div className="mt-4 text-center text-green-600">{message}</div>}

      {/* Last 5 Added Products in Add tab */}
      {activeTab === "add" && products.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-8 mb-2">Last 5 Added Products</h2>
          <ul>
            {[...products].slice(-5).reverse().map((product) => (
              <li key={product._id} className="border-b py-2 flex justify-between items-center">
                <span>
                  <b>{product.brand}</b> {product.model_name} (${product.price})
                  {product.photo && (
                    <img
                      src={`http://localhost:5000/uploads/${product.photo}`}
                      alt={product.model_name}
                      className="inline-block ml-2 rounded"
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  )}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Edit Form (only when editing) */}
      {activeTab === "edit" && editing && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-8 max-w-lg mx-auto space-y-4 border"
          encType="multipart/form-data"
          ref={editFormRef}
        >
          <input className="w-full border p-2 rounded" name="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
          <input className="w-full border p-2 rounded" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />
          <input className="w-full border p-2 rounded" name="model_name" placeholder="Model Name" value={form.model_name} onChange={handleChange} required />
          <input className="w-full border p-2 rounded" name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} />
          <input className="w-full border p-2 rounded" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          <input className="w-full border p-2 rounded" name="colorway" placeholder="Colorway" value={form.colorway} onChange={handleChange} />
          <input className="w-full border p-2 rounded" name="size" placeholder="Size" value={form.size} onChange={handleChange} />
          <input className="w-full border p-2 rounded" name="width" placeholder="Width" value={form.width} onChange={handleChange} />
          <input className="w-full border p-2 rounded" name="material" placeholder="Material" value={form.material} onChange={handleChange} />
          <input className="w-full border p-2 rounded" name="sku_code" placeholder="SKU Code" value={form.sku_code} onChange={handleChange} required />
          <input className="w-full border p-2 rounded" name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input className="w-full border p-2 rounded" name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
          <div className="flex justify-between">
            <button className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded" type="submit">
              Update Shoe
            </button>
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setEditing(null);
                setForm(initialForm);
                setPhoto(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            className="bg-white shadow-2xl rounded-lg px-3 py-4 w-[95vw] max-w-xs sm:max-w-sm md:max-w-md max-h-[70vh] overflow-y-auto relative border"
            style={{ boxSizing: "border-box" }}
            ref={editFormRef}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={() => setEditingProduct(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <form onSubmit={handleUpdate} encType="multipart/form-data" className="space-y-3">
              <input className="w-full border p-2 rounded" name="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
              <input className="w-full border p-2 rounded" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />
              <input className="w-full border p-2 rounded" name="model_name" placeholder="Model Name" value={form.model_name} onChange={handleChange} required />
              <input className="w-full border p-2 rounded" name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} />
              <input className="w-full border p-2 rounded" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
              <input className="w-full border p-2 rounded" name="colorway" placeholder="Colorway" value={form.colorway} onChange={handleChange} />
              <input className="w-full border p-2 rounded" name="size" placeholder="Size" value={form.size} onChange={handleChange} />
              <input className="w-full border p-2 rounded" name="width" placeholder="Width" value={form.width} onChange={handleChange} />
              <input className="w-full border p-2 rounded" name="material" placeholder="Material" value={form.material} onChange={handleChange} />
              <input className="w-full border p-2 rounded" name="sku_code" placeholder="SKU Code" value={form.sku_code} onChange={handleChange} required />
              <input className="w-full border p-2 rounded" name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
              <input className="w-full border p-2 rounded" name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
              <div className="flex justify-between">
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded" type="submit">
                  Update Shoe
                </button>
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:underline"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All Shoes List */}
      {activeTab === "edit" && (
        <>
          <h2 className="text-xl font-bold mt-8 mb-2">All Shoes</h2>
          <ul>
            {products.map((product) => (
              <li key={product._id} className="border-b py-2 flex justify-between items-center">
                <span>
                  <b>{product.brand}</b> {product.model_name} (${product.price})
                  {product.photo && (
                    <img
                      src={`http://localhost:5000/uploads/${product.photo}`}
                      alt={product.model_name}
                      className="inline-block ml-2 rounded"
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  )}
                </span>
                <span>
                  <button
                    className="bg-yellow-400 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Admin;