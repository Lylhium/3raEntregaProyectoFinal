import CartModel from "../models/carts.schema.js";
import { generateCartErrorInfo } from "./errors/info.js";
import enumErrors from "./errors/eNums.js";
import CustomError from "./errors/customError.js";
//log
import log from "../../config/devLogger.js";

const cartsController = {
  addedProducts: [],
};

cartsController.createCart = async (req, res) => {
  try {
    const newCart = new CartModel({});
    const cart = await newCart.save();

    res.status(201).send(cart);
  } catch (error) {
    log.error(`error creating cart ${error}`);
    res.status(500).send({ error: "Error creating cart" });
  }
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
    log.error(`error removing product from cart ${error} `);
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
    if (!product || !quantity) {
      CustomError.createError({
        name: "error al agregar productos",
        cause: generateCartErrorInfo({
          product,
          quantity,
        }),
        message: "Error al agregar productos",
        code: enumErrors.DATABASE_ERROR,
      });
    }

    await cart.save();

    res.status(200).send({ success: "Product added to cart" });
  } catch (error) {
    log.error(`error updating cart ${error}`);
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
    log.error(`Error updating product quantity ${error}`);
    res.status(500).send({ error: "Error updating product quantity" });
  }
};

cartsController.deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    await CartModel.findByIdAndDelete(cid);
    res.status(200).send({ success: "Cart deleted" });
  } catch (error) {
    log.error(`error deleting the cart ${error}`);
    res.status(500).send({ error: "Error deleting cart" });
  }
};

export default cartsController;
