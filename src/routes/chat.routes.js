import express from "express";
import {
  getAllMessages,
  createMessage,
} from "../services/messages.services.js";
import Message from "../models/message.schema.js";
import { Server } from "socket.io";
import sessionMiddleware from "../../config/session.js";
import log from "../../config/devLogger.js";

const chatRouter = express.Router();

// Configuración de socket.io y conexión de usuario
const io = new Server();
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next);
});
io.on("connection", (socket) => {
  log.info(`user connected.`);
  // Obtener el usuario de la sesión
  const { user } = socket.request.session;
  // Escuchar el evento 'chat message'
  socket.on("chat message", async (data) => {
    const { message } = data;
    // Guardar el mensaje en MongoDB
    const newMessage = new Message({ user, message });
    await newMessage.save();

    log.info(` mensaje guardado en mongoDB`);
    // Emitir el evento 'chat message' a todos los clientes conectados
    io.emit("chat message", data);
  });
  // Desconexión del usuario del socket.io
  socket.on("disconnect", () => {
    log.warn(`user disconnected.`);
  });
});

// Ruta para obtener todos los mensajes
chatRouter.get("/", getAllMessages);
// Ruta para crear un nuevo mensaje
chatRouter.post("/", createMessage);

export { chatRouter, io };
