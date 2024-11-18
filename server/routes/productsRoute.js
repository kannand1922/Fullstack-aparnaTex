import { Router } from "express";
import {
  addToCart,
  getProducts,
  getProductById,
  removeFromCart,
  getCartProducts,
  deleteProduct,
  removeCartProduct,
  placeOrder,
  getOrderDetails,
  getMyOrderDetails,
  checkUserAvailablity,
  AddWishlist,
  getWishListProducts,
  moveWishlistToCart,
  analyticsDetails,
  analyticsDetailsByProduct,
} from "../controller/productsController.js";
const router = Router();

router.post("/add", addToCart);
router.get("/prodList", getProducts);
router.get("/productDetails/:id", getProductById);
router.get("/cartList/:id", getCartProducts);
router.post("/remove", removeFromCart);
router.delete("/delete", deleteProduct);
router.delete("/removeCartProduct", removeCartProduct);
router.post("/order", placeOrder);
router.get("/orderDetails", getOrderDetails);
router.get("/myOrders/:id", getMyOrderDetails);
router.get("/order/check/:id", checkUserAvailablity);
router.post("/add/wishlist", AddWishlist);
router.get("/get/wishlist/:id", getWishListProducts);
router.get("/checkout/:id", moveWishlistToCart);
router.get("/analytics/product", analyticsDetailsByProduct);
router.get("/analytics", analyticsDetails);
// router.post("/cart", login);

export { router as productsRoutes };
