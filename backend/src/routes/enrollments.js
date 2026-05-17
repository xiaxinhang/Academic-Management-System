import express from "express";
import { authRequired } from "../middleware.js";
import { asyncHandler } from "../utils/errors.js";
import * as enrollmentController from "../controllers/enrollmentController.js";

const router = express.Router();

router.get("/", authRequired, asyncHandler(enrollmentController.list));
router.post("/", authRequired, asyncHandler(enrollmentController.create));
router.delete("/:id", authRequired, asyncHandler(enrollmentController.remove));

export default router;
