import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  owner: { type: String, default: "admin" },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
