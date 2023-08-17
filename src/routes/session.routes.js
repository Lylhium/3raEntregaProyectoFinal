import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Router } from "express";
import {
  registerUser,
  logoutUser,
  sendPasswordResetEmail,
  resetPassword,
} from "../controllers/user.controller.js";
import bodyParser from "body-parser";
import passport from "../utils/passport.js";
import config from "../utils/config.js";
import log from "../../config/devLogger.js";
import {
  getUserProducts,
  createProduct,
  getAllProducts,
} from "../controllers/product.controller.js";
import { uploader } from "../utils/utils.js";
const router = Router();

// Configuración de middlewares
router.use(express.json());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const sessionStore = MongoStore.create({
  mongoUrl: `${config.db.cs}+${config.db.cn}`,
});

router.use(
  session({
    secret: "clave123",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
router.use(passport.initialize());
router.use(passport.session());

// Ruta Home
router.get("/", (req, res) => {
  res.redirect("/login");
});

// Rutas de registro y authentication
router.get("/register", (req, res) => {
  res.render("user-register");
});

router.post("/register", registerUser);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  }),
  (req, res, next) => {
    next();
  }
);

router.get("/auth/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res, next) => {
    req.session.save(() => {
      res.redirect("/products/list");
    });
  }
);

router.get("/logout", logoutUser);

// Middleware de autorización para el rol de admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res
    .status(403)
    .json({ message: "Acceso denegado. No eres un administrador." });
}

// Middleware para verificar sesión activa
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

router.get("/current", ensureAuthenticated, (req, res) => {
  // Utiliza req.user directamente
  if (req.user) {
    const { first_name, last_name, age, role } = req.user;
    res.json({ first_name, last_name, age, role });
  } else {
    res.status(401).json({ message: "No hay una sesión activa" });
  }
});
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const user = req.user;
  const userToShow = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
    role: user.role,
  };
  res.render("dashboard", { user: userToShow });
});

router.post(
  "/products",
  ensureAuthenticated,
  uploader.single("thumbnail"),
  createProduct
);

router.get("/user/products", ensureAuthenticated, getUserProducts);

router.get("/all-products", ensureAuthenticated, getAllProducts);

router.get("/loggerTest", (req, res) => {
  log.fatal("test de log Fatal");
  log.error("test de log Error");
  log.warning("test de log warn");
  log.info("test de log info");
  log.debug("test de log debug");

  res.send("loggers registered on console.");
});

// Rutas de recuperación de contraseña
router.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

router.post("/forgot-password", sendPasswordResetEmail);
// Renderizar la página de restablecimiento de contraseña

router.get("/reset-password/:token", (req, res) => {
  const token = req.params.token;
  res.render("reset-password", { token });
});

router.post("/reset-password", resetPassword);

export default router;
