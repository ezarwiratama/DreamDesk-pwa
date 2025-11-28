import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { COLORS } from "../utils/constants";

const CartPage = () => (
  <div className="page-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh" }}>
    <ShoppingCart size={64} color={COLORS.gray} style={{ marginBottom: "20px", opacity: 0.3 }} />
    <h3 style={{ color: COLORS.gray }}>Your Cart is Empty</h3>
    <Link to="/catalog" style={{ marginTop: "20px", color: COLORS.primary, fontWeight: "bold" }}>Start Shopping</Link>
  </div>
);

export default CartPage;