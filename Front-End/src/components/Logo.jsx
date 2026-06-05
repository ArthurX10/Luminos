import React from 'react'
import logo from '../assets/Palmeiras_logo.svg.png'

function Logo() {
  return (
    <div className="logo">
      <img src={logo} alt="Logo do Luminos" style = {{width: '80px', height: '80px'}}/>
    </div>
  )
}

export default Logo
