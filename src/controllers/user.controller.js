import bcrypt from "bcrypt";
import User from "../models/user.schema.js";
//error handlers
import CustomError from "../services/errors/customError.js";
import enumErrors from "../services/errors/eNums.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import transporter from "../utils/mailer.js";
//jsonwebtoken
import jwt from "jsonwebtoken";
import config from "../utils/config.js";

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name, age, role } = req.body;

    // Verificar si el usuario ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Generar el hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear un nuevo usuario
    const newUser = new User({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      age,
      role,
    });
    if (!first_name || !email || !password || !last_name) {
      CustomError.createError({
        name: "error en la creacion de user",
        cause: generateUserErrorInfo({
          first_name,
          last_name,
          email,
          password,
        }),
        message: "error en la creacion del user",
        code: enumErrors.INVALID_TYPE_ERROR,
      });
    }
    // Guardar el usuario en la base de datos
    await newUser.save();

    res.status(200).json({ message: "usuario registrado correctamente" });
  } catch (error) {
    console.error("Error al registrar al usuario:", error);
    res.status(500).json({ message: "Error al registrar al usuario" });
  }
};

// Función para autenticar un usuario
export const authenticateUser = async (email, password) => {
  // Verificación si el correo electrónico existe en la base de datos
  const user = await User.findOne({ email });
  if (!user) {
    CustomError.createError({
      name: "error en la autenticación",
      cause: generateUserErrorInfo({
        email,
        message: "El correo electrónico no existe.",
        code: enumErrors.DATABASE_ERROR,
      }),
    });
  }

  // Verificación si la contraseña es correcta
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    CustomError.createError({
      name: "error en la autenticación",
      cause: generateUserErrorInfo({
        email,
        message: "La contraseña es incorrecta.",
        code: enumErrors.DATABASE_ERROR,
      }),
    });
  }

  // Retorno de los datos completos del usuario.
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    age: user.age,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Autenticación del usuario y obtención de los datos
    const userData = await authenticateUser(email, password);

    // Iniciar sesión automáticamente al usuario
    req.login(userData, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/products/list");
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res
      .status(400)
      .render("login", { error: "Usuario o contraseña incorrectos" });
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      CustomError.createError({
        name: "error en la autenticación",
        cause: generateUserErrorInfo({
          id,
          message: "El usuario no existe.",
          code: enumErrors.DATABASE_ERROR,
        }),
      });
    }
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    throw error;
  }
};
export const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      CustomError.createError({
        name: "error en la autenticación",
        cause: generateUserErrorInfo({
          email,
          message: "El usuario no existe.",
          code: enumErrors.DATABASE_ERROR,
        }),
      });
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = (req, res) => {
  // Cerrar sesión del usuario y redireccionar después de cerrar sesión
  req.logout(() => {
    res.redirect("/login");
  });
};

export const findOrCreateUser = async (profile, done) => {
  try {
    const { displayName, emails } = profile;
    const [first_name, last_name] = displayName.split(" ");

    let email = "";

    if (emails && emails.length > 0) {
      email = emails[0].value;
    }

    if (!email) {
      //email temporal creado con el id de github.
      email = `temp-${profile.id}@example.com`;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Si el usuario ya existe, lo devuelve sin crear uno nuevo
      return done(null, existingUser);
    } else {
      const newUser = new User({
        githubId: profile.id,
        first_name,
        last_name,
        email,
        password: "placeholder",
        age: 18,
        role,
      });

      await newUser.save();
      return done(null, newUser);
    }
  } catch (error) {
    return done(error);
  }
};

export const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "El usuario no existe." });
    }

    // Generacion el token JWT para el restablecimiento de contraseña
    const token = jwt.sign({ userId: user._id }, config.jwt.token, {
      expiresIn: "1h",
    });

    const mailOptions = {
      from: "pfarherra@gmail.com",
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `<p>Hola ${user.first_name},</p><p>Para restablecer tu contraseña, haz clic en el siguiente enlace: <a href="${process.env.BASE_URL}reset-password/${token}">Restablecer contraseña</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Correo de recuperación de contraseña enviado." });
  } catch (error) {
    console.error("Error al enviar el correo de recuperación:", error);
    res
      .status(500)
      .json({ message: "Error al enviar el correo de recuperación." });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Decodificando el token
    const decodedToken = jwt.verify(token, config.jwt.token);
    const userId = decodedToken.userId;

    // getting user from DB
    const user = await User.findById(userId);
    if (!user) {
      CustomError.createError({
        name: "user not found",
        cause: generateUserErrorInfo({
          user,
          message: "El usuario no existe.",
          code: enumErrors.DATABASE_ERROR,
        }),
      });
      return res.status(404).json({ message: "user not found" });
    }
    // if current Password is the same :
    const isPasswordSame = await bcrypt.compare(password, user.password);
    if (isPasswordSame) {
      CustomError.createError({
        name: "password cannot be the same as the current one.",
        cause: generateUserErrorInfo({
          password,
          message:
            "La nueva contraseña no puede ser igual a la contraseña actual",
          code: enumErrors.DATABASE_ERROR,
        }),
      });
      return res.status(400).json({
        message: "password cannot be the same as the current one.",
      });
    }
    // new password encrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // updating password in DB
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    if (error.name === "JsonWebTokenError" && error.message === "jwt expired") {
      return res.redirect("/forgot-password");
    }

    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
};

export const updateUserRole = async (req, res) => {
  const userId = req.params.id;
  const newRole = req.body.newRole;

  try {
    // Encuentra el usuario por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualiza el rol del usuario
    user.role = newRole;
    await user.save();

    res
      .status(200)
      .json({ message: "Rol de usuario actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el rol del usuario:", error);
    res.status(500).json({ message: "Error al actualizar el rol del usuario" });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const userId = req.params.uid;
    const { originalname, filename } = req.file;

    // Buscar al usuario por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Agregar el documento al array de documentos del usuario
    user.documents.push({
      name: originalname,
      reference: `/uploads/${filename}`,
    });

    // Guardar los cambios en el usuario
    await user.save();

    res.status(200).json({ message: "Documento subido exitosamente", user });
  } catch (error) {
    console.error("Error al subir el documento:", error);
    res.status(500).json({ message: "Error al subir el documento" });
  }
};
