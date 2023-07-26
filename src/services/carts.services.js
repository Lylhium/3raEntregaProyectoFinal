import CartModel from "../models/carts.schema.js";
import ProductModel from "../models/products.schema.js";
import Ticket from "../models/ticket.schema.js";

const cartsController = {
  addedProducts: [],
};

cartsController.getChatter = (req, res) => {
  res.render("chats");
};

cartsController.removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);

    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product.toString() === pid
    );

    if (productIndex === -1) {
      return res.status(404).send({ error: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);

    await cart.save();

    res.status(200).send({ success: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing product from cart", error);
    res.status(500).send({ error: "Error removing product from cart" });
  }
};

cartsController.updateCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const { cid } = req.params;

    const cart = await CartModel.findById(cid);

    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }

    // Agregar el producto y cantidad al carrito
    cart.products.push({
      product: product,
      quantity: quantity,
    });

    await cart.save();

    res.status(200).send({ success: "Product added to cart" });
  } catch (error) {
    console.error("Error updating cart", error);
    res.status(500).send({ error: "Error updating cart" });
  }
};
cartsController.updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await CartModel.findById(cid);

    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }

    const product = cart.products.find(
      (product) => product.product.toString() === pid
    );

    if (!product) {
      return res.status(404).send({ error: "Product not found in cart" });
    }

    product.quantity = quantity;

    await cart.save();

    res.status(200).send({ success: "Product quantity updated" });
  } catch (error) {
    console.error("Error updating product quantity", error);
    res.status(500).send({ error: "Error updating product quantity" });
  }
};

cartsController.deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    await CartModel.findByIdAndDelete(cid);
    res.status(200).send({ success: "Cart deleted" });
  } catch (error) {
    console.error("Error deleting cart", error);
    res.status(500).send({ error: "Error deleting cart" });
  }
};
// Controlador para finalizar el proceso de compra del carrito
cartsController.purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid).populate("products");

    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }

    const productsNotPurchased = [];
    let totalAmount = 0;

    for (const productItem of cartsController.addedProducts) {
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

      totalAmount += existingProduct.price * quantity;
    }
    cartsController.addedProducts = [];

    if (productsNotPurchased.length > 0) {
      cart.products = cart.products.filter(
        (productItem) =>
          !productsNotPurchased.includes(productItem.product.toString())
      );

      await cart.save();
      return res.status(400).send({ productsNotPurchased });
    }
    const purchaseDate = new Date();
    const ticket = new Ticket({
      purchase_dateTime: purchaseDate,
      amount: totalAmount,
      purchaser: "Nombre del comprador",
      idCart: cart._id,
      products: cart.products,
    });

    await ticket.save();

    cart.tickets.push(ticket._id);
    await cart.save();

    // limpieza del cart luego de utilizar endpoint.
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
export default cartsController;
