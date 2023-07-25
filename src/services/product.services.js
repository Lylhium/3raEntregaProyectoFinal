import ProductManager from "../controllers/products.controller.js";
import CartModel from "../models/carts.schema.js";

const productController = {};

productController.getAllProducts = async (req, res) => {
  try {
    const productManager = new ProductManager();
    const products = await productManager.getAllProducts();

    res.render("products", { products });
  } catch (error) {
    console.error("Error al obtener los productos", error);
    res.status(500).send("Error al obtener los productos");
  }
};

productController.registerProduct = async (req, res) => {
  try {
    const { Title, Description, Price } = req.body;

    const filename = req.file.filename;

    if (!Title || !Description || !Price || !filename)
      return res.status(400).send({ error: "Incomplete values" });

    let product = {
      Title,
      Description,
      Price,
      Thumbnail: filename,
    };

    const productManager = new ProductManager();
    const createdProduct = await productManager.createProduct(product);

    // Adding product to cart
    let cart = await CartModel.findOne({});

    if (!cart) {
      // If cart doesn't exist, create a new one
      cart = new CartModel({ products: [] });
      await cart.save();
    }

    const existingProduct = cart.products.find(
      (item) => item.product.toString() === createdProduct._id.toString()
    );

    if (existingProduct) {
      // If the product already exists in the cart, increase the quantity
      existingProduct.quantity += 1;
    } else {
      // If the product is new to the cart, add it with quantity 1
      cart.products.push({
        product: createdProduct._id,
        quantity: 1,
      });
    }

    await cart.save();

    res.status(200).send({ success: "Product created!" });
  } catch (error) {
    console.error("Error creating the product", error);
    res.status(500).send({ error: "Error creating the product" });
  }
};

productController.getProductsList = async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    const productManager = new ProductManager();
    const products = await productManager.getProducts(limit, page, sort, query);

    res.render("index", { products: products, user: req.session.user });

    console.log(req.session.user);
  } catch (error) {
    console.error("Error al obtener la lista de productos", error);
    res.status(500).send("Error al obtener la lista de productos");
  }
};

export default productController;
