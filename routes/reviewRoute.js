import express from "express";
import { authenticateUser } from "../middleware/auth.js";

import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", authenticateUser, createReview).get("/", getAllReviews);

router
  .get("/:id", getSingleReview)
  .patch("/:id", authenticateUser, updateReview)
  .delete("/:id", authenticateUser, deleteReview);

export default router;
