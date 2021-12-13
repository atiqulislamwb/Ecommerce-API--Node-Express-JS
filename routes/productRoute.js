import express from "express";

import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../controllers/productController.js";

import { authenticateUser, authorizePermissions } from "../middleware/auth.js";
import { getSingleProductReview } from "../controllers/reviewController.js";

const router = express.Router();

router
  .post("/", [authenticateUser, authorizePermissions("admin")], createProduct)
  .get("/", getAllProducts);

router.post(
  "/uploadImage",
  [authenticateUser, authorizePermissions("admin")],
  uploadImage
);

router
  .get("/:id", getSingleProduct)
  .patch(
    "/:id",
    [authenticateUser, authorizePermissions("admin")],
    updateProduct
  )
  .delete(
    "/:id",
    [authenticateUser, authorizePermissions("admin")],
    deleteProduct
  );

router.get("/:id/reviews", getSingleProductReview);

export default router;
