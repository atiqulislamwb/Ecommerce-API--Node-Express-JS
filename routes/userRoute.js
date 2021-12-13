import express from "express";

import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";

import { authenticateUser, authorizePermissions } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateUser, authorizePermissions("admin"), getAllUsers);

router
  .get("/me", authenticateUser, showCurrentUser)
  .patch("/updateUser", authenticateUser, updateUser)
  .patch("/", authenticateUser, updateUserPassword)
  .get("/:id", authenticateUser, getSingleUser);

export default router;
