import mongoose from "mongoose";
import bcrypt from "bcrypt";
import CartItem from "./cart.schema.js";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "premium"], default: "user" },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  carts: [CartItem.schema],
});

// método para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("User", userSchema);

export default User;
