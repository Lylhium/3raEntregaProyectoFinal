import mongoose from "mongoose";
import db from "../../config/db.js";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1 },
});

const CartItem = db.model("CartItem", cartItemSchema);

export default CartItem;
