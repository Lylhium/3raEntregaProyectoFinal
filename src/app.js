import express from "express";
import "dotenv/config";
import config from "./utils/config.js";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import router from "./routes/index.routes.js";
import { chatRouter, io } from "./routes/chat.routes.js";
import sessionMiddleware from "../config/session.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github";
import {
  authenticateUser,
  findOrCreateUser,
} from "./controllers/user.controller.js";
import cors from "cors";
import errorHandler from "./error/info.js";
import log from "../config/devLogger.js";

// Server
const app = express();
const PORT = config.server;

const server = app.listen(PORT, () => {
  log.info(`server running on ${PORT}`);
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

// Configuración de la carpeta public
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publics = join(__dirname, "./public");
app.set("views", join(__dirname, "views"));
app.use(express.static(publics));

// Aplicacion del middleware de sesión antes de las rutas
app.use(sessionMiddleware);

// Configuración de Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configuración de la estrategia de autenticación local
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await authenticateUser(email, password);
        if (!user) {
          return done(null, false, { message: "Credenciales inválidas" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configuración de la estrategia de autenticación de GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: "669021d7483928f0cbc4",
      clientSecret: "b9c55cc02b7114859d48ec1b031f603016fe43c8",
      callbackURL: "/auth/github/callback",
    },
    async (_, __, profile, done) => {
      try {
        const wrappedDone = (error, user) => {
          if (error) {
            return done(error);
          }
          return done(null, user);
        };
        await findOrCreateUser(profile, wrappedDone);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialización del usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialización del usuario
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Ruta principal del servidor y uso de router
app.use("/", router);
app.use(errorHandler);
// Rutas de chat utilizando el enrutador chatRouter
app.use("/chats", chatRouter);

// Configuración de socket.io
io.attach(server);

// Página de chat
app.get("/chat", (req, res) => {
  res.render("chats");
});
