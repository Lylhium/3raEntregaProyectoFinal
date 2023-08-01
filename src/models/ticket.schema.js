import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  purchase_dateTime: { type: Date, default: Date.now, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  code: {
    type: String,
    unique: true,
    required: true,
    default: function () {
      // Genera un código único utilizando el ID del ticket y la fecha actual
      return this._id + "-" + Date.now().toString(36);
    },
  },
  idCart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart", // Cambiar "CartModel" por "Cart" para que coincida con el nombre del modelo
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
