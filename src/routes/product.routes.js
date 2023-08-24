import { Router } from "express";
import {
  createProduct,
  getUserProducts,
  getAllProducts,
  deleteProduct,
} from "../controllers/product.controller.js";
import { uploader } from "../utils/utils.js";
import { generateProducts } from "../mocks/generateProducts.js";

const router = Router();

// Middleware para verificar sesión activa
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

router.post(
  "/products",
  ensureAuthenticated,
  uploader.single("thumbnail"),
  createProduct
);

router.get("/user/products", ensureAuthenticated, getUserProducts);

router.get("/all-products", ensureAuthenticated, getAllProducts);

router.post("/delete/:id", deleteProduct);

router.get("/mockingproducts", (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }
  res.json(products);
});

export default router;
