import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Grid, Monitor, Keyboard, Mouse, Armchair, Star, Heart } from "lucide-react";
import { COLORS } from "../utils/constants";
// Kita tidak butuh handleWishlist dari helper lagi, karena kita buat logika lokal

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [featuredProducts, setFeaturedProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  // 1. Tambahkan state untuk Wishlist
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const categories = [
    { name: "All", icon: <Grid size={16} /> },
    { name: "Monitor", icon: <Monitor size={16} /> },
    { name: "Keyboard", icon: <Keyboard size={16} /> },
    { name: "Mouse", icon: <Mouse size={16} /> },
    { name: "Desk", icon: <Armchair size={16} /> },
  ];

  // Fetch Data Produk
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // 2. Load Wishlist dari LocalStorage saat halaman dibuka
  useEffect(() => {
    const loadWishlist = () => {
      const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlist(saved);
    };
    loadWishlist();

    // Listener agar jika wishlist berubah di tab lain/component lain, di sini ikut berubah
    window.addEventListener("storage", loadWishlist);
    return () => window.removeEventListener("storage", loadWishlist);
  }, []);

  // 3. Fungsi Toggle Like (Sama seperti di CatalogPage)
  const toggleLike = (product) => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = saved.find((item) => item.id === product.id);

    let newWishlist;
    if (exists) {
      newWishlist = saved.filter((item) => item.id !== product.id);
    } else {
      newWishlist = [...saved, product];
    }

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
        <div style={{ background: COLORS.white, padding: "10px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <Search size={20} color={COLORS.text} />
        </div>
      </header>

      {/* Banner Carousel */}
      <div style={{ margin: "15px 20px", padding: "25px", borderRadius: "25px", background: COLORS.primary, color: "white", position: "relative", overflow: "hidden", boxShadow: "0 10px 20px rgba(128, 0, 0, 0.2)" }}>
        <div style={{ width: "65%", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "bold", lineHeight: "1.2" }}>Flat 30% Off</h2>
          <p style={{ fontSize: "0.85rem", opacity: 0.9, marginTop: "5px" }}>On your first desk setup bundle purchase.</p>
          <button style={{ backgroundColor: COLORS.orange, color: "white", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold", marginTop: "15px", fontSize: "0.85rem", cursor: "pointer" }}>Buy Now</button>
        </div>
        <div style={{ position: "absolute", right: "-30px", bottom: "-40px", width: "180px", height: "180px", background: "white", opacity: 0.1, borderRadius: "50%" }}></div>
        <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=300&q=80" alt="Setup" style={{ position: "absolute", right: '-20px', bottom: '-20px', width: '140px', height: '140px', objectFit: 'cover', borderRadius: '20px', transform: 'rotate(-10deg)', border: '4px solid rgba(255,255,255,0.2)' }} />
      </div>

      {/* Categories */}
      <div style={{ padding: "10px 0" }}>
        <div style={{ padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Categories</h3>
          <Link to="/catalog" style={{ fontSize: "0.85rem", color: COLORS.gray, textDecoration: "none" }}>View all</Link>
        </div>
        <div className="hide-scrollbar" style={{ display: "flex", overflowX: "auto", padding: "0 20px", gap: "12px" }}>
          {categories.map((cat) => (
            <button key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "30px", border: "none", cursor: "pointer", whiteSpace: "nowrap", background: activeCategory === cat.name ? COLORS.primary : COLORS.white, color: activeCategory === cat.name ? COLORS.white : COLORS.text, boxShadow: activeCategory === cat.name ? "0 4px 10px rgba(128,0,0,0.3)" : "none" }}>
              {cat.icon}
              <span style={{ fontSize: "0.9rem", fontWeight: activeCategory === cat.name ? "600" : "400" }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ padding: "20px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "15px" }}>Featured Setups</h3>
        
        {isLoading ? (
          <p style={{ textAlign: "center", color: COLORS.gray }}>Loading awesome setups...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            {featuredProducts.map((item) => {
              // 4. Cek Status Like per Item
              const isLiked = wishlist.some((w) => w.id === item.id);

              return (
                <div key={item.id} style={{ background: COLORS.white, borderRadius: "20px", padding: "12px", position: "relative", boxShadow: "0 5px 15px rgba(0,0,0,0.03)" }}>
                  
                  {/* Tombol Wishlist Dinamis */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLike(item); }} 
                    style={{ position: "absolute", top: "10px", right: "10px", background: "white", border: "none", borderRadius: "50%", padding: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", zIndex: 2, transition: '0.2s' }}
                  >
                    <Heart 
                      size={16} 
                      color={isLiked ? COLORS.primary : "#ccc"} 
                      fill={isLiked ? COLORS.primary : "none"} 
                    />
                  </button>

                  <div onClick={() => navigate(`/product/${item.id}`)}>
                    <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px", overflow: "hidden", borderRadius: "15px" }}>
                      <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: COLORS.primary, fontWeight: "bold", fontSize: "0.95rem" }}>${(item.price / 1000).toFixed(0)}k</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "0.8rem", color: "#fbbf24" }}>
                        <Star size={12} fill="#fbbf24" /> <span>{item.rating || 4.8}</span>
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

export default HomePage;