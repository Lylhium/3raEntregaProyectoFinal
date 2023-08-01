import express from "express";
import productRoutes from "./products.routes.js";
import cartRoutes from "./carts.routes.js";
import sessionRoutes from "./session.routes.js";
import ticketRoutes from "./ticket.routes.js";
const router = express.Router();
router.use(express.json());

router.use(productRoutes);
router.use(cartRoutes);
router.use(sessionRoutes);
router.use(ticketRoutes);

export default router;
