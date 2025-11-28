import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid, Heart, ShoppingCart, User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${isActive("/")}`}>
        <Home size={24} />
        {/* Dot indikator aktif */}
        {isActive("/") && <span className="dot"></span>}
      </Link>
      
      <Link to="/catalog" className={`nav-item ${isActive("/catalog")}`}>
        <Grid size={24} />
        {isActive("/catalog") && <span className="dot"></span>}
      </Link>
      
      <Link to="/wishlist" className={`nav-item ${isActive("/wishlist")}`}>
        <Heart size={24} />
        {isActive("/wishlist") && <span className="dot"></span>}
      </Link>
      
      <Link to="/cart" className={`nav-item ${isActive("/cart")}`}>
        <ShoppingCart size={24} />
        {isActive("/cart") && <span className="dot"></span>}
      </Link>
      
      <Link to="/profile" className={`nav-item ${isActive("/profile")}`}>
        <User size={24} />
        {isActive("/profile") && <span className="dot"></span>}
      </Link>
    </nav>
  );
};

export default Navbar;