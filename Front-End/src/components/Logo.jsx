import React from 'react'
import logo from '../assets/LogoT.png'

function Logo() {
  return (
    <div className="logo">
      <img src={logo} alt="Logo do Luminos" style={{ width: '50px', height: '50px' }} />
    </div>
  )
}

export default Logo
