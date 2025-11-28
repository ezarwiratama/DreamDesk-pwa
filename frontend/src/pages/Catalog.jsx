import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { COLORS } from "../utils/constants";

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  // 1. Tambahkan state untuk menyimpan daftar item yang disukai
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // Load Produk dari API
  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Gagal fetch:", err));
  }, []);

  // 2. Load Wishlist dari LocalStorage saat pertama kali buka
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(savedWishlist);
  }, []);

  // 3. Fungsi baru untuk Handle Like (Tanpa Alert & Update Warna)
  const toggleLike = (product) => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = saved.find((item) => item.id === product.id);

    let newWishlist;
    if (exists) {
      // Hapus jika sudah ada
      newWishlist = saved.filter((item) => item.id !== product.id);
    } else {
      // Tambah jika belum ada
      newWishlist = [...saved, product];
    }

    // Simpan ke localStorage & Update State agar icon berubah warnanya langsung
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    setWishlist(newWishlist);
    
    // Dispatch event agar Navbar / halaman lain tahu ada perubahan (opsional tapi bagus)
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="page-container">
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: COLORS.primary, fontWeight: "bold", marginBottom: "20px" }}>Explore Catalog</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          {products.length > 0 ? (
            products.map((item) => {
              // 4. Cek apakah item ini ada di state wishlist
              const isLiked = wishlist.some((w) => w.id === item.id);

              return (
                <div key={item.id} style={{ background: COLORS.white, borderRadius: "15px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "relative" }}>
                  
                  {/* Tombol Wishlist */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item); // Panggil fungsi toggleLike yang baru
                    }}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "white",
                      border: "none",
                      borderRadius: "50%",
                      padding: "6px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      zIndex: 2,
                      transition: "0.2s" // Efek transisi halus
                    }}
                  >
                    {/* 5. Logika Warna Icon */}
                    <Heart 
                      size={16} 
                      // Jika disukai: warna merah (COLORS.primary), jika tidak: abu-abu (#ccc)
                      color={isLiked ? COLORS.primary : "#ccc"} 
                      // Jika disukai: isi warna penuh (fill), jika tidak: kosong
                      fill={isLiked ? COLORS.primary : "none"} 
                    />
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
            })
          ) : (
            <p>Loading products...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;