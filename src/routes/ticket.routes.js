import express from "express";
import { createTicket } from "../services/ticket.services.js";

const router = express.Router();

router.post("/tickets", async (req, res) => {
  const userId = req.user._id;
  const result = await createTicket(userId);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  res.status(201).json(result);
});

export default router;
