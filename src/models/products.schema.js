import mongoose from "mongoose";
import db from "../../config/db.js";
import mongoosePaginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Thumbnail: {
    type: String,
    required: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: "admin",
  },
});

schema.plugin(mongoosePaginate);

const ProductModel = db.model("products", schema);

export default ProductModel;
