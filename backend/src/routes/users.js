import express from "express";
import { authRequired, adminOnly } from "../middleware.js";
import { asyncHandler } from "../utils/errors.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/", authRequired, adminOnly, asyncHandler(userController.list));
router.post("/", authRequired, adminOnly, asyncHandler(userController.create));
router.put("/:id", authRequired, adminOnly, asyncHandler(userController.update));
router.delete("/:id", authRequired, adminOnly, asyncHandler(userController.remove));

export default router;
