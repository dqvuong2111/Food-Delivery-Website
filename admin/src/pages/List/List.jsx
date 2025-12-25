import React, { useEffect } from "react";
import './List.css';
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { Trash2 } from "lucide-react";

const List = ({url}) => {
    const[list,setList]=useState([]);

    const fetchItems=async()=>{
        const response=await axios.get(`${url}/api/food/list`);
        if(response.data.success){
            setList(response.data.data);
        }
        else{
            toast.error("Error");
        }
    }

    const removeFood=async(foodId)=>{
        const token = localStorage.getItem("token");
        const response= await axios.post(`${url}/api/food/remove`,{id:foodId}, {headers: {token}});
        if(response.data.success){
            toast.success(response.data.message);
            await fetchItems();
        }
        else{
            toast.error("Error");
        }
    }

    const toggleAvailability = async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/food/toggle`, {id}, {headers: {token}});
        if(response.data.success){
            toast.success(response.data.message);
            await fetchItems();
        } else {
            toast.error("Error");
        }
    }

    useEffect(()=>{
        fetchItems();
    },[])

  return (  
    <div className="list add flex-col">
        <p>All Foods List</p>
        <div className="list-table-header">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Stock</b>
            <b>Action</b>
        </div>
        {list.map((item,index)=>{
           return(
            <div key={index} className="list-table-row">
                <img src={item.image.startsWith("http") ? item.image : `${url}/images/`+item.image} alt=""/>
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                <div className={`stock-toggle ${item.available ? 'available' : 'unavailable'}`} onClick={() => toggleAvailability(item._id)}>
                    {item.available ? 'In Stock' : 'Sold Out'}
                </div>
                <p onClick={()=>removeFood(item._id)} className='cursor'>
                    <Trash2 size={20} />
                </p>
            </div>
           )
        })}
    </div>
  )
}  

export default List;