
import React from 'react';
import { Link } from 'react-router-dom';

const NavbarBrand = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
        alt="Deadpunch" 
        className="h-10 md:h-12 object-contain transition-transform duration-300 hover:scale-105" 
      />
    </Link>
  );
};

export default NavbarBrand;
