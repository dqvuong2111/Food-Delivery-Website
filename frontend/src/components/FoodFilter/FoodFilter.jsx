import React, { useContext } from 'react'
import './FoodFilter.css'
import { StoreContext } from '../../context/StoreContext'

const FoodFilter = () => {

  const { minPrice, setMinPrice, maxPrice, setMaxPrice, minRating, setMinRating } = useContext(StoreContext);

  return (
    <div className='food-filter' id='food-filter'>
      <div className="filter-group">
        <label>Price Range (₫)</label>
        <div className="price-inputs">
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} placeholder="Min" />
            <span>-</span>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} placeholder="Max" />
        </div>
      </div>
      <div className="filter-group">
        <label>Minimum Rating</label>
        <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
            <option value="0">All Ratings</option>
            <option value="1">1+ Star</option>
            <option value="2">2+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="5">5 Stars</option>
        </select>
      </div>
    </div>
  )
}

export default FoodFilter