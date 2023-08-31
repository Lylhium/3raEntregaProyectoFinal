import express from "express";
import sessionRoutes from "./session.routes.js";
//import ticketRoutes from "./ticket.routes.js";
import productRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";

const router = express.Router();
router.use(express.json());

router.use(sessionRoutes);
//router.use(ticketRoutes);
router.use(productRoutes);
router.use(cartRoutes);

export default router;
