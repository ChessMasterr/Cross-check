import React from 'react'
import './Loader.css'

function Loader() {
    return (
        <div className="wave">
            <span style={{ '--i': 1 }}>A</span>
            <span style={{ '--i': 2 }}>L</span>
            <span style={{ '--i': 3 }}>A</span>
            <span style={{ '--i': 4 }}>B</span>
            <span style={{ '--i': 5 }}>U</span>
            <span style={{ '--i': 6 }}>G</span>
            <span style={{ '--i': 7 }}>A</span>
            <span style={{ '--i': 8 }}>!</span>
        </div>
    )
}

export default Loader