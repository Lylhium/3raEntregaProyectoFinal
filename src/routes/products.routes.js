import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import productController from "../services/product.services.js";
import { logoutUser } from "../controllers/user.controller.js";
import config from "../utils/config.js";
import { uploader } from "../utils/utils.js";

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

export default router;
