import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Heart, ShoppingCart, Star, Store } from "lucide-react"; 
import { COLORS } from "../utils/constants";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch(() => {
        // Fallback data jika fetch error
        setProduct({ 
            id: 1,
            name: "Ultrawide Monitor 34\"",
            price: 5500000,
            discount_price: 3850000, // Contoh data diskon
            category: "Monitor",
            description: "Monitor lengkung ultra lebar untuk produktivitas.",
            image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80",
            brand: "LG",
            seller: "DreamDesk Official",
            stock: 23,
            rating: 4.7,
            sold_count: 171
        });
      });

    const loadWishlist = () => setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    loadWishlist();
  }, [id]);

  const toggleLike = () => {
    if (!product) return;
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = saved.find((item) => item.id === product.id);
    const newWishlist = exists ? saved.filter((item) => item.id !== product.id) : [...saved, product];
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    setWishlist(newWishlist);
    window.dispatchEvent(new Event("storage"));
  };

  // --- LOGIKA ADD TO CART (UPDATED) ---
  const addToCart = () => {
    if (!product) return;
    if (product.stock <= 0) {
        alert("Maaf, stok barang ini sedang habis!");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.id === product.id);

    // Cek apakah ada diskon, gunakan harga diskon jika ada
    const hasDiscount = product.discount_price && product.discount_price < product.price;
    const finalPrice = hasDiscount ? product.discount_price : product.price;

    if (existingItem) {
      existingItem.quantity += 1;
      // Opsional: Update harga di cart jika harga di server berubah/diskon baru
      existingItem.price = finalPrice; 
    } else {
      // Simpan produk ke cart dengan harga yang sudah didiskon
      cart.push({ 
          ...product, 
          price: finalPrice, // Override harga asli dengan harga diskon agar total di Cart benar
          original_price: product.price, // Simpan harga asli untuk referensi (opsional)
          quantity: 1 
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    alert("Berhasil masuk keranjang! 🛒");
    window.dispatchEvent(new Event("storage"));
  };

  if (!product) return <div style={{ padding: 20, textAlign: 'center', marginTop: 50 }}>Loading details...</div>;

  const isLiked = wishlist.some((w) => w.id === product.id);
  
  // --- LOGIKA HITUNG DISKON ---
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercentage = hasDiscount 
      ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
      : 0;

  return (
    <div className="page-container">
      
      <div className="detail-layout">
        
        {/* KOLOM KIRI: GAMBAR */}
        <div className="detail-image-container">
          <button 
            onClick={() => navigate(-1)} 
            style={{ position: "absolute", top: 20, left: 20, zIndex: 10, background: "white", border: "none", borderRadius: "50%", width: 40, height: 40, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ChevronLeft color={COLORS.text || "#333"} />
          </button>

          <button 
            onClick={toggleLike} 
            style={{ position: "absolute", top: 20, right: 20, zIndex: 10, background: "white", border: "none", borderRadius: "50%", width: 40, height: 40, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: '0.2s' }}
          >
            <Heart color={isLiked ? COLORS.primary : "#999"} fill={isLiked ? COLORS.primary : "none"} />
          </button>

          {/* Badge Diskon di Gambar (Opsional, agar lebih menarik) */}
          {hasDiscount && (
            <div style={{ position: 'absolute', bottom: 20, left: 20, background: '#ef4444', color: 'white', padding: '5px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                Hemat {discountPercentage}%
            </div>
          )}

          <img src={product.image_url} alt={product.name} className="detail-image" />
        </div>

        {/* KOLOM KANAN: INFORMASI LENGKAP */}
        <div className="detail-info">
          
          {/* Brand Badge */}
          <div style={{ 
              display: 'inline-block', 
              padding: '4px 8px', 
              background: '#f0f0f0', 
              color: '#666', 
              borderRadius: '6px', 
              fontSize: '0.75rem', 
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '10px',
              width: 'min-content'
          }}>
            {product.brand || product.category}
          </div>

          <h2 className="detail-title" style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "10px", color: COLORS.text || "#333", lineHeight: 1.2 }}>
            {product.name}
          </h2>

          {/* Rating & Sold Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="#FFC400" color="#FFC400" /> 
                <span style={{ fontWeight: 'bold', color: '#333' }}>{product.rating || "4.5"}</span>
                <span style={{ color: '#999' }}>/ 5.0</span>
            </div>
            <div style={{ width: 1, height: 15, background: '#ddd' }}></div>
            <div style={{ color: '#666' }}>
                Terjual <span style={{ fontWeight: 'bold', color: '#333' }}>{product.sold_count || 0}</span>
            </div>
          </div>
          
          {/* --- PRICE SECTION (UPDATED) --- */}
          <div style={{ marginBottom: "25px" }}>
             {hasDiscount ? (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <span style={{ textDecoration: "line-through", color: "#999", fontSize: "1.1rem" }}>
                            Rp {product.price?.toLocaleString()}
                        </span>
                        <span style={{ background: '#ffebee', color: '#d32f2f', fontSize: '0.8rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>
                            {discountPercentage}% OFF
                        </span>
                    </div>
                    <h3 style={{ color: COLORS.primary, fontSize: "2rem", fontWeight: '800', margin: 0 }}>
                        Rp {product.discount_price?.toLocaleString()}
                    </h3>
                </div>
             ) : (
                <h3 style={{ color: COLORS.primary, fontSize: "2rem", fontWeight: 'bold', margin: 0 }}>
                    Rp {product.price?.toLocaleString()}
                </h3>
             )}
          </div>
          
          {/* Seller & Stock Info Box */}
          <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: '#F8F9FA', 
              padding: '15px', 
              borderRadius: '12px', 
              marginBottom: '25px',
              border: '1px solid #eee'
          }}>
             {/* Seller */}
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'white', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <Store size={20} color={COLORS.primary} />
                </div>
                <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>Penjual</p>
                    <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>{product.seller || "Official Store"}</p>
                </div>
             </div>

             {/* Stock */}
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'right' }}>
                <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>Stok</p>
                    <p style={{ margin: 0, fontWeight: '600', color: product.stock > 0 ? '#10B981' : '#EF4444' }}>
                        {product.stock > 0 ? `Sisa ${product.stock}` : "Habis"}
                    </p>
                </div>
             </div>
          </div>

          <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "40px", fontSize: '0.95rem' }}>
            {product.description}
          </p>
          
          {/* Tombol Add to Cart */}
          <button 
            onClick={addToCart}
            disabled={product.stock <= 0}
            style={{ 
                width: "100%", 
                background: product.stock > 0 ? COLORS.primary : "#ccc", 
                color: "white", 
                padding: "18px", 
                borderRadius: "15px", 
                border: "none", 
                fontSize: "1rem", 
                fontWeight: "bold", 
                boxShadow: product.stock > 0 ? "0 10px 20px rgba(128,0,0,0.2)" : "none", 
                cursor: product.stock > 0 ? "pointer" : "not-allowed", 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px',
                transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => { if(product.stock > 0) e.currentTarget.style.transform = "scale(1.02)" }}
            onMouseOut={(e) => { if(product.stock > 0) e.currentTarget.style.transform = "scale(1)" }}
          >
            {product.stock > 0 ? (
                <>
                    <ShoppingCart size={20} /> Tambah ke Keranjang
                </>
            ) : (
                "Stok Habis"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetailPage;