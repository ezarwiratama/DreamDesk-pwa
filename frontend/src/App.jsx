import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Components & Pages
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
        <Route
          path="/"
          element={
            <>
              <HomePage />
              <Navbar />
            </>
          }
        />
        <Route
          path="/catalog"
          element={
            <>
              <CatalogPage />
              <Navbar />
            </>
          }
        />
        <Route
          path="/wishlist"
          element={
            <>
              <WishlistPage />
              <Navbar />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <CartPage />
              <Navbar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <ProfilePage />
              <Navbar />
            </>
          }
        />
        {/* Detail page biasanya tidak butuh Navbar bawah */}
        <Route path="/product/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;