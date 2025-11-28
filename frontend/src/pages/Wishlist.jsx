import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { COLORS } from "../utils/constants";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWishlist = () => {
      const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlist(saved);
    };

    loadWishlist();
    window.addEventListener("storage", loadWishlist);
    return () => window.removeEventListener("storage", loadWishlist);
  }, []);

  const removeWishlist = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div className="page-container">
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: COLORS.primary, fontWeight: "bold", marginBottom: "20px" }}>My Wishlist</h2>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "100px", opacity: 0.5 }}>
            <Heart size={64} color={COLORS.gray} />
            <p style={{ marginTop: "20px" }}>Belum ada item yang disukai.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {wishlist.map((item) => (
              <div key={item.id} style={{ display: "flex", background: COLORS.white, borderRadius: "15px", padding: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", alignItems: "center" }}>
                <img src={item.img || item.image_url} alt={item.name} style={{ width: "80px", height: "80px", borderRadius: "10px", objectFit: "cover" }} />
                <div style={{ marginLeft: "15px", flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{item.name}</div>
                  <div style={{ color: COLORS.primary, fontWeight: "bold", marginTop: "5px" }}>Rp {item.price.toLocaleString()}</div>
                  <button onClick={() => navigate(`/product/${item.id}`)} style={{ fontSize: "0.8rem", color: COLORS.gray, background: "none", border: "none", textDecoration: "underline", marginTop: "5px", cursor: "pointer" }}>Lihat Detail</button>
                </div>
                <button onClick={() => removeWishlist(item.id)} style={{ padding: "10px", border: "none", background: "#ffebee", borderRadius: "10px", cursor: "pointer", color: COLORS.primary }}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;