import React, { useState, useEffect } from 'react'
import './Category.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const Category = ({url}) => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: ""
    });
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const response = await axios.get(`${url}/api/category/list`);
        if(response.data.success) {
            setCategories(response.data.data);
        } else {
            toast.error("Error fetching categories");
        }
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({...data, [name]:value}));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("image", image);

        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/category/add`, formData, {headers: {token}});
        if(response.data.success) {
            setData({name: ""});
            setImage(false);
            fetchCategories();
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    }

    const removeCategory = async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/category/remove`, {id}, {headers: {token}});
        if(response.data.success) {
            fetchCategories();
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    return (
        <div className='category'>
            <h3>Category Management</h3>
            
            <form className="category-form" onSubmit={onSubmitHandler}>
                <div className="add-img-upload">
                    <p>Upload Category Image</p>
                    <label htmlFor="image" className={image ? "upload-area has-image" : "upload-area"}>
                         {image ? (
                            <img src={URL.createObjectURL(image)} alt="Preview" className="image-preview" />
                        ) : (
                            <div className="upload-instructions">
                                <div className="upload-circle">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                </div>
                                <span className="upload-text-main">Click to upload</span>
                            </div>
                        )}
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                </div>

                <div className="category-input-group">
                    <p>Category Name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type category name' required />
                    <button type='submit' className='add-btn'>Add Category</button>
                </div>
            </form>

            <div className="category-list">
                <h4>Existing Categories</h4>
                <div className="category-table">
                    <div className="category-table-header">
                        <b>Image</b>
                        <b>Name</b>
                        <b>Action</b>
                    </div>
                    {categories.map((item, index) => {
                        return (
                            <div key={index} className="category-table-row">
                                <img src={`${url}/images/${item.image}`} alt="" />
                                <p>{item.name}</p>
                                <p onClick={() => removeCategory(item._id)} className='cursor'>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Category