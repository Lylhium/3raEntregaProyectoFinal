import { expect } from "chai";
import mongoose from "mongoose";
import supertest from "supertest";

mongoose.connect(
  "mongodb+srv://lilius:dEADLERDEATH123@cluster0.gsoks.mongodb.net/testing"
);

beforeEach(() => {
  mongoose.connection.collections.users.drop();
});

const requester = supertest("http://localhost:8080");

describe("Cart Routes Testing", () => {
  it("should return the cart data", async () => {
    const result = await requester.get("/api/cart/cart").send();

    expect(result.body);
    expect(result.ok).to.be.false;
  });

  it("should add a product to the cart", async () => {
    const result = await requester.post("/api/cart/add").send({
      productId: "product_id",
      quantity: 2,
    });

    expect(result.ok).to.be.false;
    expect(result.statusCode).to.be.equal(200);
  });
});
