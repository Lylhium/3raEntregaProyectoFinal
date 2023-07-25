import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  purchase_dateTime: { type: Date, default: Date.now, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  code: {
    type: String,
    unique: true,
    required: true,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
