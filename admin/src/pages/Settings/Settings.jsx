import React, { useState, useEffect } from 'react'
import './Settings.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Settings = ({url}) => {
    const [settings, setSettings] = useState({
        deliveryFee: 5,
        taxRate: 0,
        estimatedDeliveryTime: "30-45 min",
        isStoreOpen: true
    });

    const fetchSettings = async () => {
        const response = await axios.get(`${url}/api/settings/get`);
        if(response.data.success) {
            setSettings(response.data.data);
        } else {
            toast.error("Error fetching settings");
        }
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setSettings(prev => ({...prev, [name]: value}));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/settings/update`, settings, {headers: {token}});
        if(response.data.success) {
            toast.success("Settings Updated");
        } else {
            toast.error("Error updating settings");
        }
    }

    const [newAdmin, setNewAdmin] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [admins, setAdmins] = useState([]);

    const fetchAdmins = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${url}/api/user/admin/list`, {headers: {token}});
        if(response.data.success) {
            setAdmins(response.data.data);
        }
    }

    const onAdminChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setNewAdmin(prev => ({...prev, [name]: value}));
    }

    const onRegisterAdmin = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/user/register-admin`, newAdmin, {headers: {token}});
        if(response.data.success) {
            toast.success("New Admin Created Successfully");
            setNewAdmin({name: "", email: "", password: ""});
            fetchAdmins();
        } else {
            toast.error(response.data.message);
        }
    }

    const removeAdmin = async (id) => {
        if(!window.confirm("Are you sure you want to remove this admin?")) return;
        
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/user/admin/remove`, {id}, {headers: {token}});
        if(response.data.success) {
            toast.success("Admin Removed Successfully");
            fetchAdmins();
        } else {
            toast.error(response.data.message);
        }
    }

    useEffect(() => {
        fetchSettings();
        fetchAdmins();
    }, [])

    return (
        <div className='settings'>
            <h3>Global Settings</h3>
            <form className="settings-form" onSubmit={onSubmitHandler}>
                
                <div className="settings-section">
                    <h4>Store Status</h4>
                    <div className="status-toggle-wrapper">
                        <label className="switch">
                            <input type="checkbox" name="isStoreOpen" checked={settings.isStoreOpen} onChange={onChangeHandler} />
                            <span className="slider round"></span>
                        </label>
                        <span className={`status-label ${settings.isStoreOpen ? 'open' : 'closed'}`}>
                            {settings.isStoreOpen ? "Store is Open" : "Store is Closed"}
                        </span>
                    </div>
                </div>

                <div className="settings-grid">
                    <div className="settings-group">
                        <p>Delivery Fee ($)</p>
                        <input type="number" name="deliveryFee" value={settings.deliveryFee} onChange={onChangeHandler} required />
                    </div>
                    
                    <div className="settings-group">
                        <p>Tax Rate (%)</p>
                        <input type="number" name="taxRate" value={settings.taxRate} onChange={onChangeHandler} required />
                    </div>

                    <div className="settings-group">
                        <p>Est. Delivery Time</p>
                        <input type="text" name="estimatedDeliveryTime" value={settings.estimatedDeliveryTime} onChange={onChangeHandler} placeholder='e.g. 30-45 min' required />
                    </div>
                </div>

                <button type='submit' className='save-btn'>Save Changes</button>
            </form>

            <hr style={{margin: "40px 0", opacity: 0.5}} />

            <h3>Admin Management</h3>
            <form className="settings-form" onSubmit={onRegisterAdmin}>
                <div className="settings-grid">
                    <div className="settings-group">
                        <p>Name</p>
                        <input type="text" name="name" value={newAdmin.name} onChange={onAdminChange} placeholder='Admin Name' required />
                    </div>
                    <div className="settings-group">
                        <p>Email</p>
                        <input type="email" name="email" value={newAdmin.email} onChange={onAdminChange} placeholder='admin@example.com' required />
                    </div>
                    <div className="settings-group">
                        <p>Password</p>
                        <input type="password" name="password" value={newAdmin.password} onChange={onAdminChange} placeholder='Strong Password' required />
                    </div>
                </div>
                <button type='submit' className='save-btn' style={{backgroundColor: '#333'}}>Create New Admin</button>
            </form>

            <div className="admin-list" style={{marginTop: "30px"}}>
                <h4 style={{marginBottom: "15px"}}>Existing Admins</h4>
                <div className="admin-table">
                    {admins.map((admin, index) => (
                        <div key={index} className="admin-item" style={{display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #e2e8f0', alignItems: 'center'}}>
                            <div>
                                <p style={{fontWeight: '600'}}>{admin.name}</p>
                                <p style={{fontSize: '13px', color: '#64748b'}}>{admin.email}</p>
                            </div>
                            <button onClick={() => removeAdmin(admin._id)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px'}}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Settings