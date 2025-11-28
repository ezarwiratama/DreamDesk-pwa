import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Grid, Monitor, Keyboard, Mouse, Armchair, Star, Heart } from "lucide-react";
import { COLORS } from "../utils/constants";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // --- BASE URL LOGIC ---
  // Jika ada env variable VITE_API_URL, pakai itu. Jika tidak, pakai string kosong (relative path)
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const categories = [
    { name: "All", icon: <Grid size={16} /> },
    { name: "Monitor", icon: <Monitor size={16} /> },
    { name: "Keyboard", icon: <Keyboard size={16} /> },
    { name: "Mouse", icon: <Mouse size={16} /> },
    { name: "Desk", icon: <Armchair size={16} /> },
  ];

  useEffect(() => {
    // Tambahkan API_BASE_URL di depan endpoint
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error("Gagal fetch data");
        return res.json();
      })
      .then(data => {
        // Pastikan data ada sebelum di-slice
        if (Array.isArray(data)) {
            setFeaturedProducts(data.slice(0, 4));
        }
        setIsLoading(false);
      })
      .catch(err => {
          console.error(err);
          setIsLoading(false);
      });
      
    // Load Wishlist
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
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 20px 10px" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: COLORS.text }}>Hello, Dreamer! 👋</h1>
          <p style={{ color: COLORS.gray, fontSize: "0.9rem" }}>Let's build your setup.</p>
        </div>
        <div style={{ background: COLORS.white, padding: "10px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}><Search size={20} color={COLORS.text} /></div>
      </header>

      {/* Banner */}
      <div style={{ margin: "15px 20px", padding: "25px", borderRadius: "25px", background: COLORS.primary, color: "white", position: "relative", overflow: "hidden", boxShadow: "0 10px 20px rgba(128, 0, 0, 0.2)" }}>
        <div style={{ width: "65%", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "bold", lineHeight: "1.2" }}>Flat 30% Off</h2>
          <p style={{ fontSize: "0.85rem", opacity: 0.9, marginTop: "5px" }}>On your first desk setup bundle.</p>
          <button style={{ backgroundColor: COLORS.orange, color: "white", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold", marginTop: "15px", fontSize: "0.85rem", cursor: "pointer" }}>Buy Now</button>
        </div>
        <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=300&q=80" style={{ position: "absolute", right: '-20px', bottom: '-20px', width: '140px', height: '140px', objectFit: 'cover', borderRadius: '20px', transform: 'rotate(-10deg)', opacity: 0.8 }} />
      </div>

      {/* Categories */}
      <div style={{ padding: "10px 0" }}>
        <div className="hide-scrollbar" style={{ display: "flex", overflowX: "auto", padding: "0 20px", gap: "12px" }}>
          {categories.map((cat) => (
            <button key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "30px", border: "none", cursor: "pointer", whiteSpace: "nowrap", background: activeCategory === cat.name ? COLORS.primary : COLORS.white, color: activeCategory === cat.name ? COLORS.white : COLORS.text, boxShadow: activeCategory === cat.name ? "0 4px 10px rgba(128,0,0,0.3)" : "none" }}>
              {cat.icon} <span style={{ fontSize: "0.9rem", fontWeight: activeCategory === cat.name ? "600" : "400" }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured List */}
      <div style={{ padding: "20px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "15px" }}>Featured Setups</h3>
        {isLoading ? <p style={{textAlign:'center', color: '#888'}}>Loading data from server...</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            {featuredProducts.map((item) => {
              const isLiked = wishlist.some(w => w.id === item.id);
              return (
                <div key={item.id} style={{ background: COLORS.white, borderRadius: "20px", padding: "12px", position: "relative", boxShadow: "0 5px 15px rgba(0,0,0,0.03)" }}>
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(item); }} style={{ position: "absolute", top: "10px", right: "10px", background: "white", border: "none", borderRadius: "50%", padding: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", zIndex: 2 }}>
                    <Heart size={16} color={isLiked ? COLORS.primary : "#ccc"} fill={isLiked ? COLORS.primary : "none"} />
                  </button>
                  <div onClick={() => navigate(`/product/${item.id}`)}>
                    <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "15px", marginBottom: "10px" }} />
                    <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: COLORS.primary, fontWeight: "bold" }}>${(item.price / 1000).toFixed(0)}k</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "0.8rem", color: "#fbbf24" }}><Star size={12} fill="#fbbf24" /> <span>4.8</span></div>
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
export default HomePage;