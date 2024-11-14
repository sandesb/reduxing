import React from 'react';
import logo from '../assets/logo/colorized.png'; // Adjust the import path based on your file structure

const Header = () => {
  return (
    <header className="site-header">
      <div className="container">
        <div className="site-header-inner">
          <div className="brand header-brand">
            <h1 className="m-0">
              <a href="#">
                <img src={logo} alt="Logo" width="50" height="50" />
              </a>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
