import mongoose from "mongoose";
import db from "../../config/db.js";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

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
});

schema.plugin(mongoosePaginate);

const productModel = db.model(collection, schema);

export default productModel;
