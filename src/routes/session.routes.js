import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";

import {
  registerUser,
  logoutUser,
  sendPasswordResetEmail,
  resetPassword,
  updateUserRole,
  uploadDocument,
} from "../controllers/user.controller.js";
import bodyParser from "body-parser";
import passport from "../utils/passport.js";
import config from "../utils/config.js";
//import log from "../../config/devLogger.js";
import { deleteProduct } from "../controllers/product.controller.js";
import { uploader } from "../utils/utils.js";

const router = express.Router();

// Configuración de middlewares
router.use(express.json());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const sessionStore = MongoStore.create({
  mongoUrl: `${config.db.cs}${config.db.cn}`,
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
  async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        req.user.last_connection = new Date();
        await req.user.save();
      }
    } catch (error) {
      console.error(error);
    }
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

router.get("/logout", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      req.user.last_connection = new Date();
      await req.user.save();
      req.logout();
      res.redirect("/login");
    } catch (error) {
      console.error(error);
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/current", ensureAuthenticated, (req, res) => {
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
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
    role: user.role,
  };

  res.render("dashboard", { user: userToShow });
});

// Rutas de recuperación de contraseña
router.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

router.post("/forgot-password", sendPasswordResetEmail);

router.get("/reset-password/:token", (req, res) => {
  const token = req.params.token;
  res.render("reset-password", { token });
});

router.post("/reset-password", resetPassword);

router.post("/users/updateRole/:id", updateUserRole);

function isAdminOrPremium(req, res, next) {
  const user = req.user;

  if (user && (user.role === "admin" || user.role === "premium")) {
    return next();
  }
  res.status(403).json({
    message: "Acceso denegado. Solo admin o premium pueden eliminar productos.",
  });
}

router.post("/products/delete", isAdminOrPremium, deleteProduct);

// Ruta para subir documentos
router.post("/:uid/documents", uploader.single("document"), uploadDocument);

export default router;
