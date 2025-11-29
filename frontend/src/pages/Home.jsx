import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Grid, Monitor, Keyboard, Mouse, Armchair, Star, Heart, X, Headphones, Bell } from "lucide-react"; 
import { COLORS } from "../utils/constants";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const categories = [
    { name: "All", icon: <Grid size={16} /> },
    { name: "Monitor", icon: <Monitor size={16} /> },
    { name: "Keyboard", icon: <Keyboard size={16} /> },
    { name: "Mouse", icon: <Mouse size={16} /> },
    { name: "Desk", icon: <Armchair size={16} /> },
    { name: "Accessories", icon: <Headphones size={16} /> },
  ];

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal fetch data");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });

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

  // --- LOGIKA FILTER & DISPLAY ---
  const isFiltering = searchTerm !== "" || activeCategory !== "All";

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const displayProducts = isFiltering ? filteredProducts : products.slice(0, 4);

  let sectionTitle = "Featured Setups";
  if (searchTerm) {
    sectionTitle = `Result for "${searchTerm}"`;
  } else if (activeCategory !== "All") {
    sectionTitle = `${activeCategory} Setups`;
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 20px 10px" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: COLORS.text }}>Hello, Dreamer! 👋</h1>
          <p style={{ color: COLORS.gray, fontSize: "0.9rem" }}>Let's build your setup.</p>
        </div>
        
        {/* Ikon Notifikasi */}
        <div style={{ background: COLORS.white, padding: "10px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", position: 'relative' }}>
          <Bell size={20} color={COLORS.text} />
          
          {/* Opsional: Titik Merah (Badge) jika ingin terlihat ada notifikasi */}
          <div style={{ position: 'absolute', top: '10px', right: '12px', width: '8px', height: '8px', background: 'red', borderRadius: '50%', border: '1px solid white' }}></div>
        </div>
      </header>

      {/* SEARCH BAR BARU */}
      <div style={{ padding: "20px 20px 10px" }}>
        <div style={{ 
            display: 'flex', alignItems: 'center', background: 'white', 
            padding: '12px 15px', borderRadius: '15px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
        }}>
            <Search size={20} color="#999" style={{ marginRight: '10px' }} />
            <input 
                type="text" 
                placeholder="Cari setup impianmu..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', color: COLORS.text }} 
            />
            {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={18} color="#999" />
                </button>
            )}
        </div>
      </div>

      {/* Banner (Tetap ditampilkan agar estetik, tapi bisa disembunyikan jika isFiltering === true) */}
      <div style={{ margin: "10px 20px 20px", padding: "25px", borderRadius: "25px", background: COLORS.primary, color: "white", position: "relative", overflow: "hidden", boxShadow: "0 10px 20px rgba(128, 0, 0, 0.2)" }}>
        <div style={{ width: "65%", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "bold", lineHeight: "1.2" }}>Flat 30% Off</h2>
          <p style={{ fontSize: "0.85rem", opacity: 0.9, marginTop: "5px" }}>On your first desk setup bundle purchase.</p>
          
          {/* FUNGSI NAVIGASI DITAMBAHKAN DI SINI */}
          <button 
            onClick={() => navigate('/catalog')}
            style={{ backgroundColor: COLORS.orange, color: "white", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold", marginTop: "15px", fontSize: "0.85rem", cursor: "pointer" }}
          >
            Buy Now
          </button>
          
        </div>
        <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=300&q=80" style={{ position: "absolute", right: "-20px", bottom: "-20px", width: "140px", height: "140px", objectFit: "cover", borderRadius: "20px", transform: "rotate(-10deg)", opacity: 0.8 }} />
      </div>

      {/* Categories Tabs (Sekarang Berfungsi Filter) */}
      <div style={{ padding: "0 0 10px" }}>
        <div className="hide-scrollbar" style={{ display: "flex", overflowX: "auto", padding: "0 20px", gap: "10px" }}>
          {categories.map((cat) => {
             const isActive = activeCategory === cat.name;
             return (
                <button 
                    key={cat.name} 
                    onClick={() => setActiveCategory(cat.name)} 
                    style={{ 
                        display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", 
                        borderRadius: "30px", border: "none", cursor: "pointer", whiteSpace: "nowrap", 
                        background: isActive ? COLORS.primary : COLORS.white, 
                        color: isActive ? COLORS.white : COLORS.text, 
                        boxShadow: isActive ? "0 4px 10px rgba(128,0,0,0.3)" : "none",
                        transition: "0.2s"
                    }}
                >
                    {cat.icon} <span style={{ fontSize: "0.9rem", fontWeight: isActive ? "600" : "400" }}>{cat.name}</span>
                </button>
             )
          })}
        </div>
      </div>

      {/* Product List Section */}
      <div style={{ padding: "20px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "15px" }}>
            {sectionTitle}
        </h3>

        {isLoading ? (
          <p style={{ textAlign: "center", color: "#888" }}>Loading data from server...</p>
        ) : displayProducts.length === 0 ? (
           <div style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
                <p>Tidak ditemukan produk untuk "{searchTerm}"</p>
           </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            {displayProducts.map((item) => {
              const isLiked = wishlist.some((w) => w.id === item.id);
              return (
                <div
                  key={item.id}
                  style={{
                    background: COLORS.white,
                    borderRadius: "20px",
                    padding: "12px",
                    position: "relative",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.03)",
                    minWidth: 0,
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item);
                    }}
                    style={{ position: "absolute", top: "10px", right: "10px", background: "white", border: "none", borderRadius: "50%", padding: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", zIndex: 2 }}
                  >
                    <Heart size={16} color={isLiked ? COLORS.primary : "#ccc"} fill={isLiked ? COLORS.primary : "none"} />
                  </button>
                  <div onClick={() => navigate(`/product/${item.id}`)}>
                    <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "15px", marginBottom: "10px" }} />
                    <h4
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </h4>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: COLORS.primary, fontWeight: "bold", fontSize: "0.85rem" }}>
                        {formatRupiah(item.price)}
                      </span>
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