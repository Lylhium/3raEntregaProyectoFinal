import CartModel from "../models/carts.schema.js";

const cartsController = {};

cartsController.createCart = async (req, res) => {
  try {
    const newCart = new CartModel({});
    const cart = await newCart.save();

    res.status(201).send(cart);
  } catch (error) {
    console.error("Error creating cart", error);
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
    console.error("Error removing product from cart", error);
    res.status(500).send({ error: "Error removing product from cart" });
  }
};

cartsController.updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await CartModel.findById(cid);

    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }

    cart.products = products;

    await cart.save();

    res.status(200).send({ success: "Cart updated" });
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

export default cartsController;
