import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import CatalogPage from "./pages/Catalog";
import WishlistPage from "./pages/Wishlist";
import CartPage from "./pages/Cart";
import ProfilePage from "./pages/Profile";
import DetailPage from "./pages/Detail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><HomePage /><Navbar /></>} />
        <Route path="/catalog" element={<><CatalogPage /><Navbar /></>} />
        <Route path="/wishlist" element={<><WishlistPage /><Navbar /></>} />
        <Route path="/cart" element={<><CartPage /><Navbar /></>} />
        <Route path="/profile" element={<><ProfilePage /><Navbar /></>} />
        {/* <Route path="/product/:id" element={<DetailPage />} /> */}
        <Route path="/product/:id" element={<><DetailPage /><Navbar /></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;