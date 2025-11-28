import React from "react";
import { User } from "lucide-react";
import { COLORS } from "../utils/constants";

const ProfilePage = () => (
  <div className="page-container">
    <div style={{ background: COLORS.primary, color: "white", padding: "40px 20px 60px", borderRadius: "0 0 30px 30px", textAlign: "center" }}>
      <div style={{ width: "80px", height: "80px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", margin: "0 auto 15px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
        <User size={40} color="white" />
      </div>
      <h2 style={{ fontSize: "1.2rem" }}>Ezar Hardin Wiratama</h2>
      <p style={{ opacity: 0.8 }}>NIM: 21120123140116</p>
    </div>
    <div style={{ padding: "20px", marginTop: "-40px" }}>
      <div style={{ background: "white", padding: "20px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
        <h4 style={{ marginBottom: "10px", color: COLORS.primary }}>About DreamDesk</h4>
        <p style={{ fontSize: "0.9rem", color: COLORS.gray, lineHeight: "1.6" }}>
          DreamDesk adalah aplikasi e-commerce desk setup berbasis PWA. Dibangun dengan Vite React, Express JS, dan Supabase Database untuk Tugas Akhir Praktikum PPB.
        </p>
      </div>
    </div>
  </div>
);

export default ProfilePage;