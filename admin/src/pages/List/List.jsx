import React, { useEffect } from "react";
import './List.css';
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

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
        const response= await axios.post(`${url}/api/food/remove`,{id:foodId});
        if(response.data.success){
            toast.success(response.data.message);
            await fetchItems();
        }
        else{
            toast.error("Error");
        }
    }

    useEffect(()=>{
        fetchItems();
    },[])

  return (  
    <div className="list add flex-col">
        <p>All Foods List</p>
        <div className="list-table">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
        </div>
        {list.map((item,index)=>{
           return(
            <div key={index} className="list-table-format">
                <img src={`${url}/images/`+item.image} alt=""/>
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                <p onClick={()=>removeFood(item._id)} className='cursor'> X</p>
            </div>
           )
        })}
    </div>
  )
}  

export default List;