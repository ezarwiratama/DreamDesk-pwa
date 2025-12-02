import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Heart, ShoppingCart } from "lucide-react";
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
        setProduct({ 
            id: 99, 
            name: "Product Demo", 
            price: 1500000, 
            description: "Deskripsi produk tidak tersedia saat ini. Mohon cek koneksi server Anda.", 
            image_url: "https://via.placeholder.com/500" 
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

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Ganti alert biasa dengan log atau custom toast jika mau
    alert("Berhasil masuk keranjang! 🛒");
    window.dispatchEvent(new Event("storage"));
  };

  if (!product) return <div style={{ padding: 20, textAlign: 'center', marginTop: 50 }}>Loading details...</div>;

  const isLiked = wishlist.some((w) => w.id === product.id);

  return (
    // TAMBAHKAN CLASS PAGE-CONTAINER AGAR GESER KANAN SAAT ADA SIDEBAR
    <div className="page-container">
      
      <div className="detail-layout">
        
        {/* KOLOM KIRI: GAMBAR */}
        <div className="detail-image-container">
          <button 
            onClick={() => navigate(-1)} 
            style={{ position: "absolute", top: 20, left: 20, zIndex: 10, background: "white", border: "none", borderRadius: "50%", width: 40, height: 40, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ChevronLeft color={COLORS.text} />
          </button>

          <button 
            onClick={toggleLike} 
            style={{ position: "absolute", top: 20, right: 20, zIndex: 10, background: "white", border: "none", borderRadius: "50%", width: 40, height: 40, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: '0.2s' }}
          >
            <Heart color={isLiked ? COLORS.primary : COLORS.gray} fill={isLiked ? COLORS.primary : "none"} />
          </button>

          <img src={product.image_url} alt={product.name} className="detail-image" />
        </div>

        {/* KOLOM KANAN: INFORMASI */}
        <div className="detail-info">
          <h2 className="detail-title" style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "15px", color: COLORS.text }}>
            {product.name}
          </h2>
          
          <h3 style={{ color: COLORS.primary, fontSize: "1.5rem", marginBottom: "25px", fontWeight: 'bold' }}>
            Rp {product.price?.toLocaleString()}
          </h3>
          
          <p style={{ color: COLORS.gray, lineHeight: "1.8", marginBottom: "40px", fontSize: '0.95rem' }}>
            {product.description}
          </p>
          
          {/* Tombol Add to Cart */}
          <button 
            onClick={addToCart}
            style={{ 
                width: "100%", 
                background: COLORS.primary, 
                color: "white", 
                padding: "18px", 
                borderRadius: "15px", 
                border: "none", 
                fontSize: "1rem", 
                fontWeight: "bold", 
                boxShadow: "0 10px 20px rgba(128,0,0,0.2)", 
                cursor: "pointer", 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px',
                transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <ShoppingCart size={20} /> Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetailPage;