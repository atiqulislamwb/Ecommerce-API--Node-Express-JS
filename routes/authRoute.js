import express from "express";

import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register).post("/login", login).get("/logout", logout);

export default router;
