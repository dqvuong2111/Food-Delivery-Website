import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {
  
        const{food_list, searchTerm} = useContext(StoreContext)
  
    return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
             if (searchTerm === "" || item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} rating={item.averageRating} reviews={item.reviewCount} />
             }
          }
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
