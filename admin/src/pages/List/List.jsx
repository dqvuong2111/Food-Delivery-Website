import React, { useEffect } from "react";
import './List.css';
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2, Edit2, Check, X, Package, DollarSign, Tag } from "lucide-react";

const List = ({ url }) => {
    const [list, setList] = useState([]);
    const [editId, setEditId] = useState(null);
    const [tempPrice, setTempPrice] = useState("");

    const fetchItems = async () => {
        const response = await axios.get(`${url}/api/food/list`);
        if (response.data.success) {
            setList(response.data.data);
        }
        else {
            toast.error("Error");
        }
    }

    const removeFood = async (foodId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/food/remove`, { id: foodId }, { headers: { token } });
        if (response.data.success) {
            toast.success(response.data.message);
            await fetchItems();
        }
        else {
            toast.error("Error");
        }
    }

    const toggleAvailability = async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/food/toggle`, { id }, { headers: { token } });
        if (response.data.success) {
            toast.success(response.data.message);
            await fetchItems();
        } else {
            toast.error("Error");
        }
    }

    const startEditing = (item) => {
        setEditId(item._id);
        setTempPrice(item.price);
    }

    const cancelEditing = () => {
        setEditId(null);
        setTempPrice("");
    }

    const savePrice = async (id) => {
        const price = Number(tempPrice);
        if (price < 1000 || price > 10000000) {
            toast.error("Price must be between 1,000 ₫ and 10,000,000 ₫");
            return;
        }
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${url}/api/food/update`, { id, price }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                setEditId(null);
                await fetchItems();
            } else {
                toast.error("Error updating price");
            }
        } catch (error) {
            toast.error("Error updating price");
        }
    }

    useEffect(() => {
        fetchItems();
    }, [])

    return (
        <div className="list-page">
            <div className="list-header">
                <h2>Food Items</h2>
                <span className="item-count">{list.length} items</span>
            </div>

            <div className="list-grid">
                {list.map((item, index) => (
                    <div key={index} className="item-card">
                        {/* Item Image */}
                        <div className="item-image-container">
                            <img
                                src={item.image.startsWith("http") ? item.image : `${url}/images/` + item.image}
                                alt={item.name}
                                className="item-image"
                            />
                            <span
                                className={`stock-badge ${item.available ? 'in-stock' : 'sold-out'}`}
                                onClick={() => toggleAvailability(item._id)}
                            >
                                {item.available ? 'In Stock' : 'Sold Out'}
                            </span>
                        </div>

                        {/* Item Info */}
                        <div className="item-info">
                            <h3 className="item-name">{item.name}</h3>
                            <div className="item-category">
                                <Tag size={12} />
                                <span>{item.category}</span>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="item-price-section">
                            {editId === item._id ? (
                                <div className="edit-price-container">
                                    <input
                                        type="number"
                                        value={tempPrice}
                                        onChange={(e) => setTempPrice(e.target.value)}
                                        className="edit-price-input"
                                        min="1000"
                                        max="10000000"
                                        autoFocus
                                    />
                                    <button className="action-btn save" onClick={() => savePrice(item._id)} title="Save">
                                        <Check size={16} />
                                    </button>
                                    <button className="action-btn cancel" onClick={cancelEditing} title="Cancel">
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="price-display" onClick={() => startEditing(item)}>
                                    <span className="price-value">{item.price.toLocaleString()} ₫</span>
                                    <Edit2 size={14} className="edit-icon" />
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="item-actions">
                            <button
                                className={`toggle-btn ${item.available ? 'available' : 'unavailable'}`}
                                onClick={() => toggleAvailability(item._id)}
                            >
                                {item.available ? 'Mark Sold Out' : 'Mark In Stock'}
                            </button>
                            <button className="delete-btn" onClick={() => removeFood(item._id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {list.length === 0 && (
                <div className="empty-state">
                    <Package size={48} />
                    <h3>No items yet</h3>
                    <p>Add your first food item to get started</p>
                </div>
            )}
        </div>
    )
}

export default List;