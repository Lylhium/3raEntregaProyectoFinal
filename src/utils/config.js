let config = {};

config = {
  server: process.env.PORT,
};

config.db = {
  //db connection string
  cs: process.env.mongodb,
  // db collection name
  cn: process.env.dbName,
};

export default config;
