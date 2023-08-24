import { Router } from "express";
import {
  addToCart,
  readCart,
  deleteFromCart,
  editCartItem,
} from "../controllers/cart.controller.js";

const router = Router();

// Ruta para agregar un producto al carrito
router.post("/add", addToCart);

// Ruta para leer el carrito de un usuario
router.get("/cart", readCart);

// Ruta para editar la cantidad de un producto en el carrito
router.put("/edit/:productId", editCartItem);

// Ruta para eliminar un producto del carrito
router.delete("/remove/:productId", deleteFromCart);

export default router;
