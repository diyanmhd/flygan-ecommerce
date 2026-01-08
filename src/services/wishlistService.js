import API from "./api";

const wishlistService = {
  //  Get wishlist items
  getWishlist: () => API.get("/Wishlist"),

  //  Add to wishlist
  addToWishlist: (productId) =>
    API.post(`/Wishlist/${productId}`),

  //  Remove from wishlist
  removeFromWishlist: (productId) =>
    API.delete(`/Wishlist/${productId}`),
};

export default wishlistService;
