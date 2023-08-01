import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Router } from "express";
import { registerUser, logoutUser } from "../controllers/user.controller.js";
import bodyParser from "body-parser";
import passport from "../utils/passport.js";
import config from "../utils/config.js";

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
    successRedirect: "/products/list",
    failureRedirect: "/login",
  }),
  (req, res, next) => {
    req.user = req.session.user;
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

// ruta con autorización para el rol de admin
router.get("/products/list", ensureAuthenticated, isAdmin, (req, res) => {
  const user = req.user;
  res.render("index", { user });
});

// Ruta para obtener los datos del usuario actual
router.get("/current", ensureAuthenticated, (req, res) => {
  if (req.user) {
    const { first_name, last_name, age } = req.user;
    res.json({ first_name, last_name, age });
  } else {
    res.status(401).json({ message: "No hay una sesión activa" });
  }
});

export default router;
