import React from 'react'
import logo from '../assets/Palmeiras_logo.svg.png'

function Logo() {
  return (
    <div className="logo">
      <img src={logo} alt="Logo do Luminos" style = {{width: '40px', height: '40px'}}/>
    </div>
  )
}

export default Logo
