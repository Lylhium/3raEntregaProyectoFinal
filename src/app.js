import express from "express";
import "dotenv/config";
import config from "./utils/config.js";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import router from "./routes/index.routes.js";
import sessionMiddleware from "../config/session.js";
import passport from "passport";
import cors from "cors";
import errorHandler from "./error/info.js";
import log from "../config/devLogger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

// Server
const app = express();
const PORT = config.server;
app.listen(PORT, () => log.info(`Listening on ${PORT}`));

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

// swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "agustin hardware documentation",
      description: "swagger",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Aplicacion del middleware de sesión antes de las rutas
app.use(sessionMiddleware);

// Configuración de Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Ruta principal del servidor y uso de router
app.use("/", router);

// Error handler
app.use(errorHandler);
