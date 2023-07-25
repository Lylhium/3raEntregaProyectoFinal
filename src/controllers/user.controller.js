import bcrypt from "bcrypt";
import User from "../models/user.schema.js";

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

    // Guardar el usuario en la base de datos
    await newUser.save();

    res.redirect("/login"); // Redireccionar a la página de inicio de sesión
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
    throw new Error("Correo electrónico no registrado");
  }

  // Verificación si la contraseña es correcta
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Contraseña incorrecta");
  }

  // Retorno de los datos completos del usuario.
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    age: user.age,
    email: user.email,
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
      res.redirect("/products/list"); // Redireccionar al listado de productos
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
      throw new Error("Usuario no encontrado");
    }
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      email: user.email,
    };
  } catch (error) {
    throw error;
  }
};
export const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Usuario no encontrado");
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
      });

      await newUser.save();
      return done(null, newUser);
    }
  } catch (error) {
    return done(error);
  }
};
