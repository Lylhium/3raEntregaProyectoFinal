import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import config from "../src/utils/config.js";
import log from "./devLogger.js";
mongoose.connect(config.db.cs, {
  dbName: config.db.cn,
});
mongoose.plugin(mongoosePaginate);
const db = mongoose.connection;
db.on("error", (error) => {
  log.error(`Error connecting to MongoDB: ${error}`);
});
db.once("open", () => {
  log.info(`successful connection to MongoDB.`);
});
export default db;
