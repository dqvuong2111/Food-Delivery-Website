import React, { useState, useEffect } from "react";
import './Add.css';
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { UploadCloud } from "lucide-react";


const Add = ({url}) => {

    const [image, setImage] = useState(false); 
    const [categories, setCategories] = useState([]);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: ""
    });

    const fetchCategories = async () => {
        const response = await axios.get(`${url}/api/category/list`);
        if (response.data.success) {
            setCategories(response.data.data);
            if (response.data.data.length > 0 && data.category === "") {
                setData(prev => ({ ...prev, category: response.data.data[0].name }));
            }
        } else {
            toast.error("Error fetching categories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', Number(data.price));
        formData.append('category', data.category);
        formData.append('image', image);
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/food/add`, formData, {headers: {token}});
        if (response.data.success) {
            setData({
                name: "",
                description: "",
                price: "",
                category: categories.length > 0 ? categories[0].name : ""
            });
            setImage(false);
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    }


  return (  
    <div className='add'>
      <h3 className="add-title">Add New Dish</h3>
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">   
            <p>Upload Product Image</p>
            <label htmlFor="image" className={image ? "upload-area has-image" : "upload-area"}>
                {image ? (
                    <img src={URL.createObjectURL(image)} alt="Preview" className="image-preview" />
                ) : (
                    <div className="upload-instructions">
                        <div className="upload-circle">
                            <UploadCloud size={32} />
                        </div>
                        <span className="upload-text-main">Click or drag image here</span>
                        <span className="upload-text-sub">Supports: JPG, PNG, WEBP</span>
                        <div className="upload-button-mock">Browse Files</div>
                    </div>
                )}
            </label>
            <input onChange={(e)=>setImage(e.target.files[0])}  type="file" id="image" hidden required/>
        </div>
        <div className="add-product-name flex-col"> 
            <p> Product Name</p>
            <input onChange={onChangeHandler} value={data.name}  type="text" name='name' placeholder="Type here" required />
        </div>
        <div className="add-product-description flex-col"> 
            <p> Product description</p>
            <textarea onChange={onChangeHandler} value={data.description} name="description"  rows="6" placeholder="Write content here" required></textarea>
        </div>
        <div className="add-category-price">
           <div className="add-product-category flex-col"> 
              <p>Product Category</p>
              <select onChange={onChangeHandler} name="category" value={data.category}>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat.name}>{cat.name}</option>
                    ))}
              </select>
            </div>
            <div className="add-product-price flex-col">
                <p> Product Price</p>
                <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder="$20" required />
            </div>       
        </div>
        <button type="submit" className="add-btn"> Add</button>
      </form>

    </div>
  );
}  

export default Add;