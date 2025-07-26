import React, { useRef, useState, useEffect } from "react";
import { updateProduct, deleteProduct, fetchStats, fetchUsers, blockUser, fetchOrders, updateOrderStatus, deleteOrder } from "../utils/api";
import { useProducts } from "../context/ProductContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal"; // Import the AuthModal component
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import CreatableSelect from "react-select/creatable";

const initialForm = {
  brand: "",
  model_name: "",
  gender: "",
  category: "",
  width: "",
  material: "",
  price: "",
  sku_code: "", // Ensure this is always defined
  variants: [] // Array of { color, size, stock, sku }
};

const GENDER_OPTIONS = [
  { value: "Men", label: "Men" },
  { value: "Women", label: "Women" },
  { value: "Unisex", label: "Unisex" },
  { value: "Kids", label: "Kids" },
];
const CATEGORY_OPTIONS = [
  { value: "Sneakers", label: "Sneakers" },
  { value: "Running", label: "Running" },
  { value: "Basketball", label: "Basketball" },
  { value: "Casual", label: "Casual" },
  { value: "Boots", label: "Boots" },
  { value: "Sandals", label: "Sandals" },
  { value: "Slides", label: "Slides" },
  { value: "Formal", label: "Formal" },
];
const WIDTH_OPTIONS = [
  { value: "Narrow", label: "Narrow" },
  { value: "Regular", label: "Regular" },
  { value: "Wide", label: "Wide" },
  { value: "Extra Wide", label: "Extra Wide" },
];
const MATERIAL_OPTIONS = [
  { value: "Leather", label: "Leather" },
  { value: "Mesh", label: "Mesh" },
  { value: "Canvas", label: "Canvas" },
  { value: "Synthetic", label: "Synthetic" },
  { value: "Textile", label: "Textile" },
  { value: "Rubber", label: "Rubber" },
  { value: "Suede", label: "Suede" },
];

// Predefined color and size options (can be extended)
const COLOR_OPTIONS = [
  { value: "Red", label: "Red" },
  { value: "Blue", label: "Blue" },
  { value: "Green", label: "Green" },
  { value: "Black", label: "Black" },
  { value: "White", label: "White" },
  { value: "Yellow", label: "Yellow" },
  { value: "Gray", label: "Gray" },
  { value: "Pink", label: "Pink" },
  { value: "Purple", label: "Purple" },
  { value: "Orange", label: "Orange" },
];
const SIZE_OPTIONS = [
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "13", label: "13" },
  { value: "14", label: "14" },
];

function generateSKU(brand, model) {
  const brandPart = (brand || "").substring(0, 3).toUpperCase();
  const modelPart = (model || "").substring(0, 3).toUpperCase();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${brandPart}${modelPart}${randomPart}`;
}

// Helper to generate consistent SKU for a product
function generateProductSKU(brand, model) {
  const brandPart = (brand || "").substring(0, 3).toUpperCase();
  const modelPart = (model || "").substring(0, 3).toUpperCase();
  return `${brandPart}${modelPart}`;
}

const Admin = () => {
  const { products, loadProducts } = useProducts();
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("add"); // "add" or "edit"
  const [editingProduct, setEditingProduct] = useState(null); // null or product object
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [authOpen, setAuthOpen] = useState(true); // Always open auth modal on page load
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [registeredUserCount, setRegisteredUserCount] = useState(0);
  const [onlineUserCount, setOnlineUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const editFormRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.isAdmin) {
      setAuthOpen(true);
    } else {
      setAuthOpen(false);
      // Fetch dashboard stats from backend
      const fetchStatsInterval = setInterval(() => {
        fetchStats(localStorage.getItem("token"))
          .then(stats => {
            setRegisteredUserCount(stats.registeredUserCount);
            setOnlineUserCount(stats.onlineUserCount);
            setUserCount(stats.registeredUserCount); // for compatibility
            setOrderCount(stats.orderCount);
          })
          .catch(err => {
            setMessage("Failed to fetch dashboard stats. Make sure you are logged in as admin.");
            console.error("Stats fetch error:", err);
          });
      }, 1000); // Poll every 1 second for real-time online users
      // Fetch users from backend every second
      const fetchUsersInterval = setInterval(() => {
        fetchUsers(localStorage.getItem("token")).then(users => {
          // console.log("[DEBUG] fetchUsers result:", users);
          setUsers(users);
        });
      }, 1000);
      // Fetch orders from backend (one-time)
      fetchOrders(localStorage.getItem("token")).then(setOrders);
      return () => {
        clearInterval(fetchStatsInterval);
        clearInterval(fetchUsersInterval);
      };
    }
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

  // When opening the add product popup, auto-generate SKU (or reuse if exists)
  useEffect(() => {
    if (showAddPopup) {
      // Check if a product with the same brand/model exists
      const existing = products.find(p => p.brand === form.brand && p.model_name === form.model_name);
      setForm(f => ({
        ...f,
        sku_code: existing ? existing.sku_code : generateProductSKU(f.brand, f.model_name)
      }));
    }
  }, [showAddPopup, form.brand, form.model_name, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "variants") {
          formData.append("variants", JSON.stringify(value)); // Always stringify variants
        } else {
          formData.append(key, value);
        }
      });
      if (photo) formData.append("photo", photo);
      const token = localStorage.getItem("token");
      if (editing) {
        await axios.put(`/api/products/${editing}`, formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        });
        setMessage("Product updated!");
        await loadProducts(); // <-- await to ensure context is updated before closing modal
      } else {
        await axios.post("/api/products", formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        });
        setMessage("Product added!");
        await loadProducts(); // <-- await to ensure context is updated before closing modal
      }
      setForm(initialForm);
      setPhoto(null);
      setEditing(null);
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
      width: product.width || "",
      material: product.material || "",
      price: product.price || "",
      variants: product.variants || []
    });
    setEditing(product._id);
    setActiveTab("edit");
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Delete this product?")) {
      await deleteProduct(id, token);
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
      width: product.width || "",
      material: product.material || "",
      price: product.price || "",
      variants: Array.isArray(product.variants) ? product.variants : [] // Ensure variants is always an array
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
        if (key === "variants") {
          formData.append("variants", JSON.stringify(value)); // Always stringify variants
        } else {
          formData.append(key, value);
        }
      });
      if (photo) formData.append("photo", photo);
      const token = localStorage.getItem("token");
      await axios.put(`/api/products/${editingProduct._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });
      setMessage("Product updated!");
      setEditingProduct(null);
      await loadProducts(); // <-- await to ensure context is updated before closing modal
    } catch {
      setMessage("Error updating product.");
    }
  };

  // Get the last added product
  const lastProduct = products.length > 0 ? products[products.length - 1] : null;

  // Only show admin UI if authenticated and isAdmin
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.isAdmin;

  const handleAuthClose = (user) => {
    const currentUser = user || JSON.parse(localStorage.getItem("user"));
    if (!currentUser || !currentUser.isAdmin) {
      setAuthOpen(true);
    } else {
      setAuthOpen(false);
    }
  };

  const handleBlockUser = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await blockUser(id, token);
      fetchUsers(token).then(setUsers);
      setMessage("User block status updated.");
    } catch (err) {
      setMessage("Failed to update user block status.");
      console.error("Block user error:", err);
    }
  };

  const handleOrderStatusChange = async (id, status) => {
    const token = localStorage.getItem("token");
    await updateOrderStatus(id, status, token);
    fetchOrders(token).then(setOrders);
  };

  const handleDeleteOrder = async (id) => {
    const token = localStorage.getItem("token");
    await deleteOrder(id, token);
    fetchOrders(token).then(setOrders);
  };

  // Aggregate sales per product from orders
  const salesData = products.map(product => {
    const sales = orders.reduce((sum, order) => {
      return sum + order.products.filter(p => p.product?._id === product._id).reduce((acc, p) => acc + p.quantity, 0);
    }, 0);
    return {
      name: product.model_name,
      sales,
    };
  });

  // State for variant editor
  const [variantInput, setVariantInput] = useState({ color: '', size: '', stock: '' });
  const [colorList, setColorList] = useState(COLOR_OPTIONS);
  const [sizeList, setSizeList] = useState(SIZE_OPTIONS);

  // Update VariantEditor to use dropdowns
  function VariantEditor({ variants, setVariants, brand, model, colorOptions, sizeOptions, isEdit }) {
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [editInput, setEditInput] = useState({ color: '', size: '', stock: '', sku: '' });
    const [addInput, setAddInput] = useState({ color: '', size: '', stock: '' });

    // Find the variant matching the selected color and size
    const selectedIdx = variants.findIndex(v => v.color === selectedColor && v.size === selectedSize);
    const selectedVariant = selectedIdx !== -1 ? variants[selectedIdx] : null;

    React.useEffect(() => {
      if (selectedVariant) {
        setEditInput({ ...selectedVariant });
      } else {
        setEditInput({ color: selectedColor, size: selectedSize, stock: '', sku: '' });
      }
    }, [selectedColor, selectedSize, selectedVariant]);

    // Auto-select first color and size if variants exist and nothing is selected
    React.useEffect(() => {
      if (variants.length > 0 && !selectedColor) {
        setSelectedColor(variants[0].color);
      }
    }, [variants]);
    React.useEffect(() => {
      if (selectedColor && variants.length > 0) {
        const sizesForColor = variants.filter(v => v.color === selectedColor).map(v => v.size);
        if (sizesForColor.length > 0 && !selectedSize) {
          setSelectedSize(sizesForColor[0]);
        }
      }
    }, [selectedColor, variants]);

    const handleEditChange = e => {
      const { name, value } = e.target;
      setEditInput(v => ({ ...v, [name]: value }));
    };

    const handleAddChange = e => {
      const { name, value } = e.target;
      setAddInput(v => ({ ...v, [name]: value }));
    };

    const handleSaveEdit = () => {
      if (!editInput.color || !editInput.size || !editInput.stock) return;
      const updated = variants.map((v, idx) => idx === selectedIdx ? { ...editInput, stock: Number(editInput.stock) } : v);
      setVariants(updated);
    };

    const handleRemoveVariant = () => {
      setVariants(variants.filter((v, idx) => idx !== selectedIdx));
      setSelectedColor("");
      setSelectedSize("");
    };

    const handleAddVariant = () => {
      if (!addInput.color || !addInput.size || !addInput.stock) return;
      setVariants([...(variants || []), { ...addInput, stock: Number(addInput.stock), sku: `${brand?.substring(0,3)?.toUpperCase() || ''}${model?.substring(0,3)?.toUpperCase() || ''}-${addInput.color}-${addInput.size}` }]);
      setAddInput({ color: '', size: '', stock: '' });
    };

    // Get available colors and sizes from existing variants
    const availableColors = [...new Set(variants.map(v => v.color))];
    const availableSizes = selectedColor ? [...new Set(variants.filter(v => v.color === selectedColor).map(v => v.size))] : [];

    // Only show selection section if isEdit is true
    return (
      <div>
        {isEdit && (
          <div className="mb-2 flex gap-2 items-center">
            <div className="text-sm font-bold text-dachriNavy">Select variant to edit:</div>
            <select className="border p-2 rounded" value={selectedColor} onChange={e => { setSelectedColor(e.target.value); setSelectedSize(""); }}>
              <option value="">Color</option>
              {availableColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            <select className="border p-2 rounded" value={selectedSize} onChange={e => setSelectedSize(e.target.value)} disabled={!selectedColor}>
              <option value="">Size</option>
              {availableSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
        {/* Edit form for selected variant */}
        {isEdit && selectedVariant && (
          <div className="flex gap-2 mb-2 items-end mt-2 bg-blue-50 p-2 rounded border border-blue-200">
            <select className="border p-2 rounded w-1/4" name="color" value={editInput.color} onChange={handleEditChange}>
              <option value="">Color</option>
              {colorOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select className="border p-2 rounded w-1/4" name="size" value={editInput.size} onChange={handleEditChange}>
              <option value="">Size</option>
              {sizeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input className="border p-2 rounded w-1/4" name="stock" type="number" min="0" placeholder="Stock" value={editInput.stock} onChange={handleEditChange} />
            <input className="border p-2 rounded w-1/4 bg-gray-100" name="sku" placeholder="SKU" value={editInput.sku} readOnly />
            <button type="button" className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleSaveEdit}>Save</button>
            <button type="button" className="text-red-500 hover:underline" onClick={handleRemoveVariant}>Remove</button>
          </div>
        )}
        {/* Add new variant form (always show in add, only when not editing in edit) */}
        {(!isEdit || !selectedVariant) && (
          <div className="flex gap-2 mb-2 mt-2 bg-gray-50 p-2 rounded border border-gray-200">
            <select className="border p-2 rounded w-1/4" name="color" value={addInput.color} onChange={handleAddChange}>
              <option value="">Color</option>
              {colorOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select className="border p-2 rounded w-1/4" name="size" value={addInput.size} onChange={handleAddChange}>
              <option value="">Size</option>
              {sizeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input className="border p-2 rounded w-1/4" name="stock" type="number" min="0" placeholder="Stock" value={addInput.stock} onChange={handleAddChange} />
            <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleAddVariant}>Add</button>
          </div>
        )}
        {/* Always show list of added variants */}
        {variants.length > 0 && (
          <div className="mt-2">
            <div className="font-semibold text-sm mb-1">Added Variants:</div>
            <ul className="space-y-1">
              {variants.map((v, idx) => (
                <li key={v.sku || v.color + v.size} className="flex items-center gap-2 text-xs bg-gray-100 rounded px-2 py-1">
                  <span>{v.color} / {v.size} / Stock: {v.stock} / SKU: {v.sku}</span>
                  {!isEdit && (
                    <button type="button" className="text-red-500 hover:underline ml-2" onClick={() => setVariants(variants.filter((_, i) => i !== idx))}>Remove</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <AuthModal isOpen={authOpen} onClose={handleAuthClose} isAdminSide={true} title="Admin Login" />
      {(!authOpen && isAdmin) ? (
        <div>
          <div className="w-full text-center py-4 bg-dachriRed text-white text-2xl font-bold rounded-t-xl shadow mb-6">
            Admin Dashboard
          </div>
          <div className="container mx-auto p-4">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded shadow p-4 text-center">
                <div className="text-3xl font-bold text-dachriRed">{registeredUserCount}</div>
                <div className="text-gray-600">Registered Users</div>
              </div>
              <div className="bg-white rounded shadow p-4 text-center">
                <div className="text-3xl font-bold text-dachriRed">{onlineUserCount}</div>
                <div className="text-gray-600">Online Users</div>
              </div>
              <div className="bg-white rounded shadow p-4 text-center">
                <div className="text-3xl font-bold text-dachriRed">{products.length}</div>
                <div className="text-gray-600">Products</div>
              </div>
              <div className="bg-white rounded shadow p-4 text-center">
                <div className="text-3xl font-bold text-dachriRed">{orderCount}</div>
                <div className="text-gray-600">Orders</div>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex justify-center mb-6">
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold focus:outline-none transition ${activeTab === "add" ? "bg-blue-600 text-white shadow" : "bg-gray-200 text-gray-700"}`}
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
                className={`px-6 py-2 rounded-t-lg font-semibold focus:outline-none transition ${activeTab === "edit" ? "bg-blue-600 text-white shadow" : "bg-gray-200 text-gray-700"}`}
                onClick={() => {
                  setActiveTab("edit");
                  setEditing(null);
                  setForm(initialForm);
                  setPhoto(null);
                }}
              >
                Edit Product
              </button>
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold focus:outline-none transition ${activeTab === "users" ? "bg-blue-600 text-white shadow" : "bg-gray-200 text-gray-700"}`}
                onClick={() => setActiveTab("users")}
              >
                Manage Users
              </button>
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold focus:outline-none transition ${activeTab === "orders" ? "bg-blue-600 text-white shadow" : "bg-gray-200 text-gray-700"}`}
                onClick={() => setActiveTab("orders")}
              >
                Manage Orders
              </button>
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold focus:outline-none transition ${activeTab === "analytics" ? "bg-blue-600 text-white shadow" : "bg-gray-200 text-gray-700"}`}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
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
                    <input className="w-full border p-2 rounded" name="brand" placeholder="Brand" value={form.brand || ""} onChange={handleChange} required />
                    <input className="w-full border p-2 rounded" name="model_name" placeholder="Model Name" value={form.model_name || ""} onChange={handleChange} required />
                    <div>
                      <label className="block font-semibold mb-1">Gender</label>
                      <select
                        className="w-full border p-2 rounded"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select gender</option>
                        {GENDER_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Category</label>
                      <select
                        className="w-full border p-2 rounded"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select category</option>
                        {CATEGORY_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Width</label>
                      <select
                        className="w-full border p-2 rounded"
                        name="width"
                        value={form.width}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select width</option>
                        {WIDTH_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Material</label>
                      <select
                        className="w-full border p-2 rounded"
                        name="material"
                        value={form.material}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select material</option>
                        {MATERIAL_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <input className="w-full border p-2 rounded bg-gray-100" name="sku_code" placeholder="SKU Code" value={form.sku_code || ""} readOnly />
                    {/* Variants Section */}
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Variants (Color, Size, Stock)</label>
                      <VariantEditor
                        variants={form.variants}
                        setVariants={v => setForm(f => ({ ...f, variants: v }))}
                        brand={form.brand}
                        model={form.model_name}
                        colorOptions={colorList}
                        sizeOptions={sizeList}
                        isEdit={false}
                      />
                    </div>
                    <input className="w-full border p-2 rounded" name="price" type="number" step="0.01" placeholder="Price" value={form.price || ""} onChange={handleChange} required />
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
                        <b>{product.brand}</b> {product.model_name} <span className="text-dachriRed">(KES {Number(product.price).toLocaleString('en-KE', { style: 'decimal', maximumFractionDigits: 2 })})</span>
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
                <input className="w-full border p-2 rounded" name="brand" placeholder="Brand" value={form.brand || ""} onChange={handleChange} required />
                <input className="w-full border p-2 rounded" name="model_name" placeholder="Model Name" value={form.model_name || ""} onChange={handleChange} required />
                {/* Gender dropdown */}
                <div>
                  <label className="block font-semibold mb-1">Gender</label>
                  <select
                    className="w-full border p-2 rounded"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select gender</option>
                    {GENDER_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {/* Category dropdown */}
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    className="w-full border p-2 rounded"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {/* Width dropdown */}
                <div>
                  <label className="block font-semibold mb-1">Width</label>
                  <select
                    className="w-full border p-2 rounded"
                    name="width"
                    value={form.width}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select width</option>
                    {WIDTH_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {/* Material dropdown */}
                <div>
                  <label className="block font-semibold mb-1">Material</label>
                  <select
                    className="w-full border p-2 rounded"
                    name="material"
                    value={form.material}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select material</option>
                    {MATERIAL_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <input className="w-full border p-2 rounded" name="price" type="number" step="0.01" placeholder="Price" value={form.price || ""} onChange={handleChange} required />
                {/* Variants Section */}
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Variants (Color, Size, Stock)</label>
                  <VariantEditor
                    variants={form.variants || []}
                    setVariants={variants => setForm(f => ({ ...f, variants }))}
                    brand={form.brand}
                    model={form.model_name}
                    colorOptions={COLOR_OPTIONS}
                    sizeOptions={SIZE_OPTIONS}
                    isEdit={true} // Always true in edit mode
                  />
                </div>
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
                    <input className="w-full border p-2 rounded" name="brand" placeholder="Brand" value={form.brand || ""} onChange={handleChange} required />
                    <input className="w-full border p-2 rounded" name="model_name" placeholder="Model Name" value={form.model_name || ""} onChange={handleChange} required />
                    <input className="w-full border p-2 rounded" name="gender" placeholder="Gender" value={form.gender || ""} onChange={handleChange} />
                    <input className="w-full border p-2 rounded" name="category" placeholder="Category" value={form.category || ""} onChange={handleChange} />
                    <input className="w-full border p-2 rounded" name="width" placeholder="Width" value={form.width || ""} onChange={handleChange} />
                    <input className="w-full border p-2 rounded" name="material" placeholder="Material" value={form.material || ""} onChange={handleChange} />
                    <input className="w-full border p-2 rounded" name="price" type="number" step="0.01" placeholder="Price" value={form.price || ""} onChange={handleChange} required />
                    {/* Variants Section */}
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Variants (Color, Size, Stock)</label>
                      <VariantEditor
                        variants={form.variants || []}
                        setVariants={variants => setForm(f => ({ ...f, variants }))}
                        brand={form.brand}
                        model={form.model_name}
                        colorOptions={COLOR_OPTIONS}
                        sizeOptions={SIZE_OPTIONS}
                        isEdit={true} // Always true in edit mode
                      />
                    </div>
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

            {/* User Management Tab */}
            {activeTab === "users" && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Users</h2>
                <ul>
                  {users.map(user => (
                    <li key={user._id} className="border-b py-2 flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        {/* Green dot if online (using lastActive logic, 10s window) */}
                        {user.lastActive && (Date.now() - new Date(user.lastActive).getTime() < 10000) && (
                          <span title="Online" className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                        )}
                        <b>{user.email}</b> {user.isAdmin && <span className="text-xs bg-dachriRed text-white px-2 py-1 rounded ml-2">Admin</span>}
                        {user.blocked && <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded ml-2">Blocked</span>}
                      </span>
                      <span>
                        {!user.isAdmin && (
                          <button
                            className={`px-3 py-1 rounded ${user.blocked ? "bg-green-500" : "bg-red-500"} text-white`}
                            onClick={() => handleBlockUser(user._id)}
                          >
                            {user.blocked ? "Unblock" : "Block"}
                          </button>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Order Management Tab */}
            {activeTab === "orders" && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Orders</h2>
                <ul>
                  {orders.map(order => (
                    <li key={order._id} className="border-b py-2 flex flex-col md:flex-row justify-between items-center">
                      <span>
                        <b>Order ID:</b> {order._id} <br />
                        <b>User:</b> {order.user?.email || "-"} <br />
                        <b>Total:</b> ${order.total} <br />
                        <b>Status:</b> {order.status}
                        <br />
                        <b>Products:</b>
                        <ul className="ml-4">
                          {order.products.map((p, idx) => (
                            <li key={idx}>
                              {p.product?.brand} {p.product?.model_name} x{p.quantity}
                            </li>
                          ))}
                        </ul>
                      </span>
                      <span className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
                        <select
                          value={order.status}
                          onChange={e => handleOrderStatusChange(order._id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                          onClick={() => handleDeleteOrder(order._id)}
                        >
                          Delete
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Sales Analytics</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#d32f2f" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="mt-4 text-gray-600">Sales data is aggregated from real orders.</p>
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
                        <b>{product.brand}</b> {product.model_name} <span className="text-dachriRed">(KES {Number(product.price).toLocaleString('en-KE', { style: 'decimal', maximumFractionDigits: 2 })})</span>
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
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-white text-dachriNavy text-xl font-bold">
          <span>Debug: Admin login modal should be visible. If not, check modal logic.</span>
          Please login as admin to access this page.
        </div>
      )}
    </>
  );
};

export default Admin;