import { expect } from "chai";
import assert from "assert";
import mongoose from "mongoose";
// 1) utilizando supertest
import supertest from "supertest";
import { user, userNoName } from "../../mocks/users.mocks.js";

mongoose.connect(
  "mongodb+srv://lilius:dEADLERDEATH123@cluster0.gsoks.mongodb.net/testing"
);

beforeEach(() => {
  mongoose.connection.collections.users.drop(); // antes de correr el codigo nuevamente este elimina la collection hecha
});

// 2) utilizando supertest con la ruta local del server(tiene que estar prendido)
const requester = supertest("http://localhost:8080");

describe("Session Routes testing", () => {
  it("it should return the login html body", async () => {
    // 3) guardamos en una variable el resultado del endpoint /login
    const result = await requester.get("/login").send();

    //console.log(result);
    //console.log(result.statusCode);

    expect(result.body);
    //expect(result.body.status).equal("success");
    expect(result.body.payload);
    expect(result.ok).to.be.true;
  });

  it("should create a user", async () => {
    const result = await requester.post("/register").send(user);

    console.log(result.body);

    expect(result.ok).to.be.true;
    expect(result.statusCode).to.be.equal(200);
  });

  it("it should fail if name is not provided ", async () => {
    const result = await requester.post("/register").send(userNoName);

    expect(result.ok).to.be.false;
    expect(result.statusCode).to.deep.equal(400);
  });
});
