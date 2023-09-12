import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  purchase_dateTime: { type: Date, default: Date.now },
});

ticketSchema.pre("save", function (next) {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDate()}`;
  const uniqueCode = `${this._id}${formattedDate}`;
  this.code = uniqueCode;
  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
