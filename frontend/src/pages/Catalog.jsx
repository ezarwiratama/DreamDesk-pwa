import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search, X, Grid, Monitor, Keyboard, Mouse, Armchair, Headphones, Star } from "lucide-react"; 
import { COLORS } from "../utils/constants";

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // State untuk Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  // Data Kategori
  const categories = [
    { name: "All", icon: <Grid size={16} /> },
    { name: "Monitor", icon: <Monitor size={16} /> },
    { name: "Keyboard", icon: <Keyboard size={16} /> },
    { name: "Mouse", icon: <Mouse size={16} /> },
    { name: "Desk", icon: <Armchair size={16} /> },
    { name: "Accessories", icon: <Headphones size={16} /> },
  ];

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
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

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: COLORS.primary, fontWeight: "bold", marginBottom: "20px" }}>Explore Catalog</h2>

        {/* 1. Search Bar */}
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'white', 
            padding: '12px 15px', 
            borderRadius: '15px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
            marginBottom: '15px' 
        }}>
            <Search size={20} color="#999" style={{ marginRight: '10px' }} />
            <input 
                type="text" 
                placeholder="Cari setup impianmu..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                    border: 'none', outline: 'none', width: '100%', 
                    fontSize: '0.95rem', color: COLORS.text
                }} 
            />
            {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={18} color="#999" />
                </button>
            )}
        </div>

        {/* 2. Category Tabs */}
        <div className="hide-scrollbar" style={{ display: "flex", overflowX: "auto", gap: "10px", paddingBottom: "5px", marginBottom: "20px" }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button 
                key={cat.name} 
                onClick={() => setActiveCategory(cat.name)}
                style={{ 
                  display: "flex", alignItems: "center", gap: "6px", 
                  padding: "8px 16px", borderRadius: "20px", border: "none", 
                  cursor: "pointer", whiteSpace: "nowrap",
                  background: isActive ? COLORS.primary : "white", 
                  color: isActive ? "white" : COLORS.text,
                  boxShadow: isActive ? "0 4px 10px rgba(128,0,0,0.2)" : "0 2px 5px rgba(0,0,0,0.05)",
                  transition: "0.2s"
                }}
              >
                {cat.icon}
                <span style={{ fontSize: "0.85rem", fontWeight: isActive ? "600" : "400" }}>{cat.name}</span>
              </button>
            )
          })}
        </div>

        {/* 3. Product Grid */}
        {products.length === 0 ? (
            <p style={{color: '#888', textAlign: 'center'}}>Loading catalog...</p>
        ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
                <p>Tidak ada produk "{searchTerm}" di kategori {activeCategory}.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                  style={{ marginTop: '10px', color: COLORS.primary, background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Reset Filter
                </button>
            </div>
        ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            {filteredProducts.map((item) => {
                const isLiked = wishlist.some(w => w.id === item.id);
                return (
                <div key={item.id} style={{ background: COLORS.white, borderRadius: "15px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "relative" }}>
                    {/* Tombol Like */}
                    <button onClick={(e) => { e.stopPropagation(); toggleLike(item); }} style={{ position: "absolute", top: "10px", right: "10px", background: "white", border: "none", borderRadius: "50%", padding: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", zIndex: 2 }}>
                       <Heart size={16} color={isLiked ? COLORS.primary : "#ccc"} fill={isLiked ? COLORS.primary : "none"} />
                    </button>
                    
                    {/* Konten Kartu */}
                    <div onClick={() => navigate(`/product/${item.id}`)} style={{ cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}>
                        <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "140px", objectFit: "cover" }} />
                        
                        <div style={{ padding: "12px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                            {/* Nama Produk */}
                            <div style={{ 
                                fontSize: "0.9rem", 
                                fontWeight: "bold", 
                                marginBottom: "8px", 
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                height: "1.6em",
                                lineHeight: "1.3"
                            }}>
                                {item.name}
                            </div>
                            
                            {/* Wrapper Harga & Statistik (biar selalu di bawah) */}
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                {/* Harga */}
                                <div style={{ color: COLORS.primary, fontWeight: "bold", fontSize: "0.95rem", marginBottom: "4px" }}>
                                    {formatRupiah(item.price)}
                                </div>
                                
                                {/* Rating & Terjual (DISINI PERUBAHANNYA) */}
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem", color: "#888" }}>
                                    {/* Bintang & Rating */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                                        <Star size={12} fill="#fbbf24" color="#fbbf24" /> 
                                        <span style={{ color: "#333", fontWeight: "600" }}>{item.rating || 4.5}</span>
                                    </div>
                                    
                                    {/* Garis Pemisah */}
                                    <div style={{ width: "1px", height: "10px", background: "#ddd" }}></div>
                                    
                                    {/* Sold Count */}
                                    <div>{item.sold_count || 0} Terjual</div>
                                </div>
                            </div>

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