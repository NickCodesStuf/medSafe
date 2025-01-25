import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <header className='header'>
      <a href='/' className='logo'>medSafe</a>

      <nav className='navbar'>
        <a href='/'>About</a>
        <a href='/'>Pricing</a>
        <a href='/'>Contact</a>
        <a href='/'>Login</a>
      </nav>
    </header>
  )
}

export default Navbar
