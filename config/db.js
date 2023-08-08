import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import config from "../src/utils/config.js";
import log from "./devLogger.js";
mongoose.connect(config.db.cs, {
  dbName: config.db.cn,
});
mongoose.plugin(mongoosePaginate);
const db = mongoose.connection;
db.on("error", log.error.bind(`error connecting to mongoDB`));
db.once("open", () => {
  log.info(`successful connection to MongoDB.`);
});
export default db;
