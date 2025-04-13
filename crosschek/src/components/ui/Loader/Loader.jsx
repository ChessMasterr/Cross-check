import React from 'react'
import './Loader.css'

function Loader() {
  return (
    <div className='loader'>
      <div className='loader-container'>
        <div className='loader-circle'></div>
        <div className='loader-circle'></div>
        <div className='loader-circle'></div>
      </div>
    </div>
  )
}

export default Loader