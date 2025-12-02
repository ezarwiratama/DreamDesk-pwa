import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid, Heart, ShoppingCart, User } from "lucide-react";

// --- IMPORT GAMBAR LOGO DARI ASSETS ---
// Pastikan file 'logo.png' sudah ada di folder src/assets/
import logoImage from "../assets/logo.png"; 

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navigation">
      
      {/* AREA LOGO (Hanya muncul di Desktop via CSS) */}
      <div className="logo-container">
        <img src={logoImage} alt="DreamDesk Logo" className="sidebar-logo" />
      </div>

      {/* MENU ITEMS */}
      <Link to="/" className={`nav-item ${isActive("/")}`}>
        <Home size={24} />
        <span className="nav-label">Home</span>
        {isActive("/") && <span className="dot"></span>}
      </Link>
      
      <Link to="/catalog" className={`nav-item ${isActive("/catalog")}`}>
        <Grid size={24} />
        <span className="nav-label">Catalog</span>
        {isActive("/catalog") && <span className="dot"></span>}
      </Link>
      
      <Link to="/wishlist" className={`nav-item ${isActive("/wishlist")}`}>
        <Heart size={24} />
        <span className="nav-label">Wishlist</span>
        {isActive("/wishlist") && <span className="dot"></span>}
      </Link>
      
      <Link to="/cart" className={`nav-item ${isActive("/cart")}`}>
        <ShoppingCart size={24} />
        <span className="nav-label">Cart</span>
        {isActive("/cart") && <span className="dot"></span>}
      </Link>
      
      <Link to="/profile" className={`nav-item ${isActive("/profile")}`}>
        <User size={24} />
        <span className="nav-label">Profile</span>
        {isActive("/profile") && <span className="dot"></span>}
      </Link>
    </nav>
  );
};

export default Navbar;