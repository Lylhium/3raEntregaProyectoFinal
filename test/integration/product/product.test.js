import { expect } from "chai";

import mongoose from "mongoose";
// 1) utilizando supertest
import supertest from "supertest";

mongoose.connect(
  "mongodb+srv://lilius:dEADLERDEATH123@cluster0.gsoks.mongodb.net/testing"
);

// 2) utilizando supertest con la ruta local del server(tiene que estar prendido)
const requester = supertest("http://localhost:8080");

describe("Product Routes Testing", () => {
  it("it should return all items ", async () => {
    const result = await requester.get("/all-products").send();

    expect(result.body);
    expect(result.body.payload);
    expect(result).to.be.a("object");
    //console.log(result);
  });

  it("it should create an product", async () => {
    const newProd = {
      title: "gtx 3050",
      description: "asus",
      price: 125000,
      owner: "agustinpfarherr@gmail.com",
    };

    const result = await requester.post("/products").send(newProd);

    console.log(result.body.payload);

    //expect(result.statusCode).to.be.equal(200);
  });
});
