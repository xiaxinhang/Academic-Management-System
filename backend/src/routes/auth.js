import express from "express";
import { asyncHandler } from "../utils/errors.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post("/login", asyncHandler(authController.login));

export default router;
