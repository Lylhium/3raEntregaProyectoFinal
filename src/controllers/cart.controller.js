import User from "../models/user.schema.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Busca al usuario por su ID y agrega el producto al carrito
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          carts: {
            productId,
            quantity,
          },
        },
      },
      { new: true } // Devuelve el usuario actualizado
    );

    res.status(200).json({ message: "Producto agregado al carrito", user });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ message: "Error al agregar producto al carrito" });
  }
};

// Leer el carrito de un usuario
export const readCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Busca al usuario por su ID y obtengo el cart
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ cart: user.carts });
  } catch (error) {
    console.error("Error al obtener el carrito del usuario:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el carrito del usuario" });
  }
};

export const editCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;
    const { newQuantity } = req.body;

    // Actualiza la cantidad del producto en el carrito directamente
    const user = await User.findOneAndUpdate(
      { _id: userId, "carts.productId": productId },
      {
        $set: { "carts.$.quantity": newQuantity },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verifica si el producto se encontraba en el carT
    const updatedCartItem = user.carts.find(
      (item) => item.productId === productId
    );
    if (!updatedCartItem) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en el carrito" });
    }

    // Verifica si la nueva cantidad es válida
    if (newQuantity <= 0) {
      return res.status(400).json({ message: "Cantidad inválida" });
    }

    res.status(200).json({
      message: "Cantidad de producto en el carrito actualizada",
      user,
    });
  } catch (error) {
    console.error(
      "Error al editar la cantidad del producto en el carrito:",
      error
    );
    res.status(500).json({
      message: "Error al editar la cantidad del producto en el carrito",
    });
  }
};

// Eliminar un producto del carrito con una cantidad específica
export const deleteFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    // Busca al usuario por su ID y el producto en el carrito
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          carts: {
            productId: productId,
          },
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado del carrito", user });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ message: "Error al eliminar producto del carrito" });
  }
};
