import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import config from "../src/utils/config.js";

mongoose.connect(config.db.cs, {
  dbName: config.db.cn,
});
mongoose.plugin(mongoosePaginate);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error en conectarse a MongoDB"));
db.once("open", () => {
  console.log("Conexión satisfactoria a MongoDB");
});
export default db;
