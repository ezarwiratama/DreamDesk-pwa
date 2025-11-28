// Fungsi Logika Wishlist
export const handleWishlist = (product) => {
  const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const exists = saved.find((item) => item.id === product.id);

  let newWishlist;
  if (exists) {
    newWishlist = saved.filter((item) => item.id !== product.id);
    alert("Dihapus dari Wishlist");
  } else {
    newWishlist = [...saved, product];
    alert("Ditambahkan ke Wishlist ❤️");
  }
  localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  window.dispatchEvent(new Event("storage"));
};