import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { COLORS } from "../utils/constants";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load Cart saat halaman dibuka
  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(savedCart);
    };
    loadCart();
    // Listener agar update realtime jika ada perubahan storage
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  // Update Cart ke LocalStorage
  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  // Tambah Quantity
  const increaseQty = (id) => {
    const newCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    updateCart(newCart);
  };

  // Kurang Quantity
  const decreaseQty = (id) => {
    const newCart = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) };
      }
      return item;
    });
    updateCart(newCart);
  };

  // Hapus Item
  const removeItem = (id) => {
    const newCart = cartItems.filter((item) => item.id !== id);
    updateCart(newCart);
  };

  // Hitung Total Harga
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  // -- RENDER EMPTY STATE --
  if (cartItems.length === 0) {
    return (
      <div className="page-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh" }}>
        <ShoppingCart size={64} color={COLORS.gray} style={{ marginBottom: "20px", opacity: 0.3 }} />
        <h3 style={{ color: COLORS.gray }}>Your Cart is Empty</h3>
        <Link to="/catalog" style={{ marginTop: "20px", color: COLORS.primary, fontWeight: "bold" }}>Start Shopping</Link>
      </div>
    );
  }

  // -- RENDER CART LIST --
  return (
    <div className="page-container" style={{ paddingBottom: '160px' }}> {/* Padding bawah besar agar tidak ketutup total & navbar */}
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: COLORS.primary, fontWeight: "bold", marginBottom: "20px" }}>My Cart</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {cartItems.map((item) => (
            <div key={item.id} style={{ display: "flex", background: "white", borderRadius: "15px", padding: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", position: "relative" }}>
              {/* Gambar Produk */}
              <img src={item.image_url} alt={item.name} style={{ width: "80px", height: "80px", borderRadius: "10px", objectFit: "cover" }} />
              
              {/* Info Produk */}
              <div style={{ marginLeft: "15px", flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontWeight: "bold", fontSize: "0.95rem", paddingRight: '30px' }}>{item.name}</div>
                    <div style={{ color: COLORS.primary, fontWeight: "bold", fontSize: "0.9rem" }}>Rp {item.price.toLocaleString()}</div>
                </div>

                {/* Kontrol Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                    <button onClick={() => decreaseQty(item.id)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Minus size={14} />
                    </button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.quantity || 1}</span>
                    <button onClick={() => increaseQty(item.id)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Plus size={14} />
                    </button>
                </div>
              </div>

              {/* Tombol Hapus (Pojok Kanan Atas) */}
              <button 
                onClick={() => removeItem(item.id)} 
                style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'none', color: '#ff6b6b', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bagian Total & Checkout (Floating di atas Navbar) */}
      <div style={{ 
          position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', 
          width: '90%', maxWidth: '400px', background: 'white', padding: '15px 20px', 
          borderRadius: '20px', boxShadow: '0 -5px 20px rgba(0,0,0,0.1)', display: 'flex', 
          justifyContent: 'space-between', alignItems: 'center', zIndex: 900 , marginBottom: '20px'
      }}>
          <div>
              <div style={{ fontSize: '0.8rem', color: COLORS.gray }}>Total Price</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: COLORS.primary }}>Rp {totalPrice.toLocaleString()}</div>
          </div>
          <button style={{ background: COLORS.primary, color: 'white', padding: '10px 25px', borderRadius: '15px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              Checkout
          </button>
      </div>
    </div>
  );
};

export default CartPage;