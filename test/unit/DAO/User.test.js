import assert from "assert";
import { expect, use } from "chai";
import mongoose from "mongoose";
import Users from "../../../src/models/Users.dao.js";
// importacion de mock de users con faker
import { generateNewUser } from "../../mocks/generateProducts.js";
import * as userMocks from "../../mocks/users.mocks.js";

mongoose.connect(
  "mongodb+srv://lilius:dEADLERDEATH123@cluster0.gsoks.mongodb.net/testing"
);

describe("testeo de user", function () {
  this.timeout(6000);
  let userDao;

  before(() => {
    userDao = new Users();
  });

  beforeEach(() => {
    mongoose.connection.collections.users.drop();
  });

  it("GET - debe devolver todos los usuarios en formato array", async () => {
    const result = await userDao.get();
    assert.strictEqual(Array.isArray(result), true);
  });

  it("Debe agregar correctamente un nuevo usuario con array de prod vacio", async () => {
    const newUser = {
      first_name: "juan",
      last_name: "fasola",
      email: `temp-@example.com`,
      password: "pass",
      age: "20",
    };

    const id = await userDao.save(newUser);
    const result = await userDao.getBy({ _id: id });

    assert.strictEqual(Array.isArray(result.products), true);
    assert.deepStrictEqual(result.products, []);
  });

  it("debo poder hacer un update de un usuario", async () => {
    const user = await userDao.save(userMocks.usuario1);

    await userDao.update({ _id: user._id }, userMocks.usuario2);
    const result = await userDao.getBy({ _id: user._id });

    expect(result.first_name).deep.equal(userMocks.usuario2.first_name);
    expect(result.last_name).deep.equal(userMocks.usuario2.last_name);
    expect(result.email).deep.equal(userMocks.usuario2.email);
    expect(result).to.be.an("object");
    expect(result.first_name).to.be.a("string");
  });

  it("delete del usuario", async () => {
    const id = await userDao.save(userMocks.usuario1);
    await userDao.delete(id);

    const result = await userDao.getBy({ _id: id });
    expect(result).deep.equal(null);
    expect(result).to.be.null;
  });
});
