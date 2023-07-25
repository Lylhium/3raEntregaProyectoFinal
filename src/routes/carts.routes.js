import express from "express";
import cartsController from "../services/carts.services.js";

const router = express.Router();

// Ruta para crear un nuevo carrito
router.post("/carts", cartsController.createCart);

router.get("/chatter", cartsController.getChatter);

router.delete(
  "/carts/:cid/products/:pid",
  cartsController.removeProductFromCart
);

router.put("/carts/:cid", cartsController.updateCart);

router.put("/carts/:cid/products/:pid", cartsController.updateProductQuantity);

router.delete("/carts/:cid", cartsController.deleteCart);

// no se esta utiliando
//router.post("/carts/:cid/purchase", cartsController.purchaseCart);

export default router;
