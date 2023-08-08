// messageController.mjs
import log from "../../config/devLogger.js";
import Message from "../models/message.schema.js";

// Obtener todos los mensajes
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    log.error(`error getting messages, ${error}`);
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};

// Crear un nuevo mensaje
export const createMessage = async (req, res) => {
  try {
    const { user, message } = req.body;
    const newMessage = new Message({ user, message });
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    log.error(`error creating messages ${error}`);
    res.status(500).json({ error: "Error al crear el mensaje" });
  }
};
