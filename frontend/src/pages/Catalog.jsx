import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { COLORS } from "../utils/constants";

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // --- BASE URL LOGIC ---
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    // Gunakan URL Dinamis
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => {
          if(!res.ok) throw new Error("Fetch failed");
          return res.json();
      })
      .then((data) => setProducts(data))
      .catch(err => console.error(err));
      
    const loadWishlist = () => setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    loadWishlist();
    window.addEventListener("storage", loadWishlist);
    return () => window.removeEventListener("storage", loadWishlist);
  }, []);

  const toggleLike = (product) => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = saved.find((item) => item.id === product.id);
    const newWishlist = exists ? saved.filter((item) => item.id !== product.id) : [...saved, product];
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    setWishlist(newWishlist);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="page-container">
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: COLORS.primary, fontWeight: "bold", marginBottom: "20px" }}>Explore Catalog</h2>
        {products.length === 0 ? <p style={{color: '#888'}}>Loading catalog...</p> : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            {products.map((item) => {
                const isLiked = wishlist.some(w => w.id === item.id);
                return (
                <div key={item.id} style={{ background: COLORS.white, borderRadius: "15px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "relative" }}>
                    <button onClick={(e) => { e.stopPropagation(); toggleLike(item); }} style={{ position: "absolute", top: "10px", right: "10px", background: "white", border: "none", borderRadius: "50%", padding: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", zIndex: 2 }}>
                    <Heart size={16} color={isLiked ? COLORS.primary : "#ccc"} fill={isLiked ? COLORS.primary : "none"} />
                    </button>
                    <div onClick={() => navigate(`/product/${item.id}`)}>
                    <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "140px", objectFit: "cover" }} />
                    <div style={{ padding: "12px" }}>
                        <div style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "5px" }}>{item.name}</div>
                        <div style={{ color: COLORS.primary, fontWeight: "bold" }}>Rp {item.price.toLocaleString()}</div>
                    </div>
                    </div>
                </div>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
};
export default CatalogPage;