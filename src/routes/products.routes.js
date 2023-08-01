import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import productController from "../services/product.services.js";
import { logoutUser } from "../controllers/user.controller.js";
import config from "../utils/config.js";
import { uploader } from "../utils/utils.js";
import { generateProducts } from "../mocks/generateProducts.js";
const router = express.Router();
const sessionStore = MongoStore.create({
  mongoUrl: `${config.db.cs}+${config.db.cn}`,
});

// Configuración de la sesión y almacenamiento en MongoDB
router.use(
  session({
    secret: "clave123",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

router.get("/products", productController.getAllProducts);

router.get("/products/register", (req, res) => {
  res.render("register");
});

router.post(
  "/products/register",
  uploader.single("Thumbnail"),
  productController.registerProduct
);

router.get("/products/list", productController.getProductsList);

// Ruta para el logout
router.get("/logout", logoutUser);

router.get("/mockingproducts", (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }
  res.json(products);
});

export default router;
