import Ticket from "../models/ticket.schema.js";
import User from "../models/user.schema.js";

export const createTicket = async (userId) => {
  try {
    const user = await User.findById(userId).populate("carts.productId");
    if (!user) {
      return { error: "Usuario no encontrado" };
    }

    const productsInCart = user.carts.map((cartItem) => cartItem.productId);

    if (productsInCart.length === 0) {
      return { error: "El carrito está vacío" };
    }

    const ticket = new Ticket({ products: productsInCart });
    await ticket.save();

    user.carts = [];
    await user.save();

    return { message: "Ticket creado exitosamente", ticket };
  } catch (error) {
    console.error("Error al crear el ticket:", error);
    return { error: "Error al crear el ticket" };
  }
};
