import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Heart } from "lucide-react";
import { COLORS } from "../utils/constants";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]); // State untuk cek status like

  // Ambil URL Backend dari Environment Variable
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    // 1. Fetch Detail Produk dengan URL Dinamis
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch(() => {
        // Fallback data jika backend error/loading lama
        setProduct({ 
            id: 99, 
            name: "Product Demo", 
            price: 1500000, 
            description: "Deskripsi produk...", 
            image_url: "https://via.placeholder.com/300" 
        });
      });

    // 2. Load Wishlist Data
    const loadWishlist = () => setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    loadWishlist();
  }, [id]);

  // 3. Fungsi Toggle Like (Konsisten dengan halaman lain)
  const toggleLike = () => {
    if (!product) return;

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
    window.dispatchEvent(new Event("storage")); // Kabari komponen lain
  };

  if (!product) return <div style={{ padding: 20, textAlign: 'center', marginTop: 50 }}>Loading details...</div>;

  // Cek apakah produk ini ada di wishlist
  const isLiked = wishlist.some((w) => w.id === product.id);

  return (
    <div style={{ background: "white", minHeight: "100vh", paddingBottom: "80px" }}>
      <div style={{ position: "relative" }}>
        {/* Tombol Back */}
        <button 
            onClick={() => navigate(-1)} 
            style={{ position: "absolute", top: 20, left: 20, zIndex: 10, background: "white", border: "none", borderRadius: "50%", width: 40, height: 40, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <ChevronLeft color={COLORS.text} />
        </button>

        {/* Tombol Wishlist Dinamis */}
        <button 
            onClick={toggleLike} 
            style={{ position: "absolute", top: 20, right: 20, zIndex: 10, background: "white", border: "none", borderRadius: "50%", width: 40, height: 40, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: '0.2s' }}
        >
          <Heart 
            color={isLiked ? COLORS.primary : COLORS.gray} 
            fill={isLiked ? COLORS.primary : "none"} 
          />
        </button>

        <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "350px", objectFit: "cover", borderBottomLeftRadius: "30px", borderBottomRightRadius: "30px" }} />
      </div>

      <div style={{ padding: "25px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "10px" }}>{product.name}</h2>
        <h3 style={{ color: COLORS.primary, fontSize: "1.3rem", marginBottom: "20px" }}>Rp {product.price?.toLocaleString()}</h3>
        <p style={{ color: COLORS.gray, lineHeight: "1.6", marginBottom: "30px" }}>{product.description}</p>
        <button style={{ width: "100%", background: COLORS.primary, color: "white", padding: "18px", borderRadius: "15px", border: "none", fontSize: "1rem", fontWeight: "bold", boxShadow: "0 10px 20px rgba(128,0,0,0.2)", cursor: "pointer" }}>Add to Cart</button>
      </div>
    </div>
  );
};

export default DetailPage;