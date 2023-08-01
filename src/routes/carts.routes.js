import express from "express";
import cartsController from "../services/carts.services.js";

const router = express.Router();

// Ruta para crear un nuevo carrito
router.post("/carts", cartsController.createCart);

//este endpoint sirve para agregar productos mediante body.
router.put("/carts/:cid", cartsController.updateCart);

router.put("/carts/:cid/products/:pid", cartsController.updateProductQuantity);

router.delete("/carts/:cid", cartsController.deleteCart);

router.delete(
  "/carts/:cid/products/:pid",
  cartsController.removeProductFromCart
);

router.get("/chatter", cartsController.getChatter);

export default router;
