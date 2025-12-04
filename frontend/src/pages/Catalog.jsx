import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  X,
  Grid,
  Monitor,
  Keyboard,
  Mouse,
  Armchair,
  Headphones,
  Star,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from "lucide-react"; 
import { COLORS } from "../utils/constants";

// --- KOMPONEN LAZY IMAGE ---
const LazyImage = ({ src, alt, style, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, []);

  return (
    <div 
      ref={imgRef} 
      className={className}
      style={{ 
        ...style, 
        position: 'relative', 
        overflow: 'hidden', 
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      )}

      {!isLoaded && (
        <ImageIcon size={24} color="#ccc" style={{ opacity: 0.5 }} />
      )}
    </div>
  );
};

// --- HALAMAN UTAMA ---
const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

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

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-container">
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: COLORS.primary, fontWeight: "bold", marginBottom: "20px" }}>Explore Catalog</h2>

        {/* Search Bar */}
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

        {/* Category Tabs */}
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

        {/* Product Grid */}
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
            <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                {currentProducts.map((item) => {
                    const isLiked = wishlist.some(w => w.id === item.id);
                    
                    // --- LOGIKA HITUNG DISKON ---
                    const hasDiscount = item.discount_price && item.discount_price < item.price;
                    const discountPercentage = hasDiscount 
                        ? Math.round(((item.price - item.discount_price) / item.price) * 100) 
                        : 0;

                    return (
                    <div key={item.id} style={{ background: COLORS.white, borderRadius: "15px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "relative" }}>
                        
                        {/* --- BADGE DISKON (NEW) --- */}
                        {hasDiscount && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                background: '#ef4444', // Warna Merah Terang
                                color: 'white',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                zIndex: 2,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                                {discountPercentage}% OFF
                            </div>
                        )}

                        {/* Like Button */}
                        <button onClick={(e) => { e.stopPropagation(); toggleLike(item); }} style={{ position: "absolute", top: "10px", right: "10px", background: "white", border: "none", borderRadius: "50%", padding: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", zIndex: 2 }}>
                           <Heart size={16} color={isLiked ? COLORS.primary : "#ccc"} fill={isLiked ? COLORS.primary : "none"} />
                        </button>
                        
                        {/* Content */}
                        <div onClick={() => navigate(`/product/${item.id}`)} style={{ cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}>
                            
                            <LazyImage 
                                src={item.image_url} 
                                alt={item.name} 
                                style={{ width: "100%", height: "140px" }} 
                            />
                            
                            <div style={{ padding: "12px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                                <div style={{ 
                                    fontSize: "0.9rem", fontWeight: "bold", marginBottom: "8px", 
                                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: "1.6em", lineHeight: "1.3" 
                                }}>
                                    {item.name}
                                </div>
                                
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                    
                                    {/* --- TAMPILAN HARGA DENGAN DISKON (UPDATED) --- */}
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {hasDiscount ? (
                                            <>
                                                <div style={{ fontSize: "0.7rem", textDecoration: "line-through", color: "#999", marginBottom: "0px" }}>
                                                    {formatRupiah(item.price)}
                                                </div>
                                                <div style={{ color: COLORS.primary, fontWeight: "bold", fontSize: "0.95rem" }}>
                                                    {formatRupiah(item.discount_price)}
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ color: COLORS.primary, fontWeight: "bold", fontSize: "0.95rem", marginBottom: "2px" }}>
                                                {formatRupiah(item.price)}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#888", marginBottom: "4px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                                            <Star size={10} fill="#fbbf24" color="#fbbf24" /> 
                                            <span style={{ color: "#333", fontWeight: "600" }}>{item.rating || 4.5}</span>
                                        </div>
                                        <div style={{ width: "1px", height: "10px", background: "#ddd" }}></div>
                                        <div style={{ fontSize: "0.7rem" }}>{item.sold_count || 0} Terjual</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    );
                })}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', gap: '8px' }}>
                        
                        {/* Previous Button */}
                        <button 
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{ 
                                background: 'white', border: '1px solid #eee', borderRadius: '50%', 
                                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                opacity: currentPage === 1 ? 0.5 : 1,
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}
                        >
                            <ChevronLeft size={20} color={COLORS.text} />
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                style={{
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: currentPage === number ? COLORS.primary : 'transparent',
                                    color: currentPage === number ? 'white' : '#888',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: '0.2s',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {number}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button 
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{ 
                                background: 'white', border: '1px solid #eee', borderRadius: '50%', 
                                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                opacity: currentPage === totalPages ? 0.5 : 1,
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}
                        >
                            <ChevronRight size={20} color={COLORS.text} />
                        </button>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};
export default CatalogPage;