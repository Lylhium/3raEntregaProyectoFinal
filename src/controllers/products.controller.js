import productModel from "../models/products.schema.js";

class ProductManager {
  constructor() {}

  async createProduct(prod) {
    try {
      // Obtener el último producto agregado
      const lastProduct = await productModel
        .findOne({}, {}, { sort: { id: -1 } })
        .lean();

      // Obtener el último ID y aumentarlo en 1
      const lastProductId = lastProduct ? lastProduct.id : 0;
      const newProductId = lastProductId + 1;

      // Agregar el ID al objeto de producto
      const productWithId = { ...prod, id: newProductId };

      // Crear el nuevo producto
      const result = await productModel.create(productWithId);

      return result;
    } catch (error) {
      console.error("Error creating the product", error);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const products = await productModel.find().lean();
      return products;
    } catch (error) {
      console.error("Error getting all products", error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await productModel.findById(productId).lean();
      return product;
    } catch (error) {
      console.error("Error getting the product by ID", error);
      throw error;
    }
  }

  async getProducts(limit, page, sort, query) {
    try {
      const options = {
        limit: limit || 10,
        page: page || 1,
        sort: sort || { id: 1 },
        lean: true,
      };

      const queryObj = query || {};

      const result = await productModel.paginate(queryObj, options);
      //console.log(result); // Console log del resultado de productModel.paginate()

      return result.docs;
    } catch (error) {
      console.error("Error getting the products", error);
      throw error;
    }
  }
}

export default ProductManager;
