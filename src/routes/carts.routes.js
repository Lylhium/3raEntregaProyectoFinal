import express from "express";
import cartsController from "../services/carts.services.js";

const router = express.Router();

router.delete(
  "/carts/:cid/products/:pid",
  cartsController.removeProductFromCart
);

// Ruta para finalizar el proceso de compra del carrito
router.post("/carts/:cid/purchase", cartsController.purchaseCart);

//este endpoint sirve para agregar productos mediante body.
router.put("/carts/:cid", cartsController.updateCart);

router.put("/carts/:cid/products/:pid", cartsController.updateProductQuantity);

router.delete("/carts/:cid", cartsController.deleteCart);

router.get("/chatter", cartsController.getChatter);

export default router;
