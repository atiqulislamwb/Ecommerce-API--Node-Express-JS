import express from "express";

import { authenticateUser, authorizePermissions } from "../middleware/auth.js";

import {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .post("/", authenticateUser, createOrder)
  .get("/", authenticateUser, authorizePermissions("admin"), getAllOrders);

router.get("/showAllMyOrder", authenticateUser, getCurrentUserOrders);

router
  .get("/:id", authenticateUser, getSingleOrder)
  .patch("/:id", authenticateUser, updateOrder);

export default router;
