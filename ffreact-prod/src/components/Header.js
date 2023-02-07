import NavBar from './NavBar';
import React from 'react'

const Header = () => {
  return (
    <header>
      <div className="nav-area">
        <a href="/" className="logo">
          Logo
        </a>
        <NavBar />
      </div>
    </header>
  );
};

export default Header;