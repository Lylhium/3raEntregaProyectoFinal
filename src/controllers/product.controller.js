import Product from "../models/product.schema.js";
import User from "../models/user.schema.js";

export const createProduct = async (req, res) => {
  const { title, description, price } = req.body;

  // Verificar el rol del usuario antes de permitir la creación de productos
  if (req.user.role !== "premium" && req.user.role !== "admin") {
    return res.status(403).json({
      message:
        "Acceso denegado. Solo usuarios premium y admin pueden crear productos.",
    });
  }

  try {
    // Crear el nuevo producto
    const product = new Product({
      title,
      description,
      price,
      thumbnail: req.file.filename,
      owner: req.user.email,
    });

    // Guardar el producto en la base de datos
    await product.save();

    // Asociar el producto al usuario actual
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { $push: { products: product._id } });

    res.status(201).json({ message: "Producto creado exitosamente", product });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ message: "Error al crear el producto" });
  }
};

export const getUserProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("products");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ products: user.products });
  } catch (error) {
    console.error("Error al obtener los productos del usuario:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los productos del usuario" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

export const deleteProduct = async (req, res) => {
  const productId = req.params.id; // Obtén el ID del producto desde los parámetros de la URL
  const userId = req.user.id; // Obtén el ID del usuario actualmente autenticado

  try {
    // Busca el producto por su ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Verifica si el usuario actual es el propietario o si es un administrador
    if (product.owner.toString() === userId || req.user.role === "admin") {
      // Si el usuario es el propietario o es un administrador, permite la eliminación
      await Product.findByIdAndRemove(productId);
      res.status(200).json({ message: "Producto eliminado con éxito" });
    } else {
      res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este producto" });
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};
