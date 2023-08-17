// utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail", // Puedes cambiarlo según el servicio de correo que uses
  auth: {
    user: "pfarherra@gmail.com", // Cambiar por tu dirección de correo
    pass: "wirprpghtfsaztvy", // Cambiar por tu contraseña
  },
});

export default transporter;
