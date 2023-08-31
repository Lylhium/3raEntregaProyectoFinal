import User from "./user.schema.js";

export default class Users {
  get = (params) => {
    return User.find(params);
  };

  getBy = (params) => {
    console.log("params: ", params);
    return User.findOne(params);
  };

  save = (doc) => {
    return User.create(doc);
  };

  update = (id, doc) => {
    return User.findByIdAndUpdate(id, { $set: doc });
  };

  delete = (id) => {
    return User.findByIdAndDelete(id);
  };
}
