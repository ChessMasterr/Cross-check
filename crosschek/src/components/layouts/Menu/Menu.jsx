import React from 'react'
import { Link } from 'react-router-dom'
import './Menu.css'
function Menu() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/review">Review</Link></li>
        <li><Link to="/account">Account</Link></li>
      </ul>
    </nav>
  )
}

export default Menu