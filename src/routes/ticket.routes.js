import express from "express";
import ticketController from "../services/tickets.services.js";
import cartsController from "../services/carts.services.js";

const router = express.Router();

router.post("/carts/:cid/purchase", (req, res) => {
  const addedProducts = cartsController.addedProducts;

  ticketController.createTicket(req, res, addedProducts);
});

export default router;
