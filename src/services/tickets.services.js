import CartModel from "../models/carts.schema.js";
import ProductModel from "../models/products.schema.js";
import TicketModel from "../models/ticket.schema.js";

const ticketController = {};

ticketController.createTicket = async (req, res, addedProducts) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid).populate("products");

    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }

    const productsNotPurchased = [];
    let totalAmount = 0;

    for (const productItem of addedProducts) {
      const { product, quantity } = productItem;
      const existingProduct = await ProductModel.findById(product);

      if (!existingProduct) {
        return res
          .status(404)
          .send({ error: `Product with ID ${product} not found` });
      }

      if (existingProduct.stock >= quantity) {
        existingProduct.stock -= quantity;
        await existingProduct.save();
      } else {
        productsNotPurchased.push(product);
      }

      totalAmount += existingProduct.Price * quantity;
    }

    // Restablecemos addedProducts después de usarlos
    addedProducts = [];

    if (productsNotPurchased.length > 0) {
      // Si hay productos que no pudieron comprarse por falta de stock, actualiza el carrito
      cart.products = cart.products.filter(
        (productItem) =>
          !productsNotPurchased.includes(productItem.product.toString())
      );

      await cart.save();
      return res.status(400).send({ productsNotPurchased });
    }

    // Todos los productos tienen suficiente stock, crea el ticket y finaliza la compra
    const purchaseDate = new Date();
    const ticket = new TicketModel({
      purchase_dateTime: purchaseDate,
      amount: totalAmount, // Utilizamos el monto total calculado
      purchaser: cart._id,
      idCart: cart._id,
      products: cart.products, // se agregan los prod al cart.
    });

    await ticket.save();

    cart.tickets.push(ticket._id);
    await cart.save();

    // limpio el cart despues de realizar el ticket.
    cart.products = [];
    await cart.save();

    res
      .status(200)
      .send({ success: "Purchase completed successfully", ticket });
  } catch (error) {
    console.error("Error purchasing cart", error);
    res.status(500).send({ error: "Error purchasing cart" });
  }
};

export default ticketController;
