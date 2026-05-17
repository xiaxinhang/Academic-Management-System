import express from "express";
import { authRequired, roleRequired } from "../middleware.js";
import { asyncHandler } from "../utils/errors.js";
import * as gradeController from "../controllers/gradeController.js";

const router = express.Router();

router.get("/export", authRequired, asyncHandler(gradeController.exportCsv));
router.get("/distribution", authRequired, asyncHandler(gradeController.distribution));
router.get("/averages", authRequired, asyncHandler(gradeController.averages));
router.get("/", authRequired, asyncHandler(gradeController.list));
router.post("/", authRequired, roleRequired("admin", "teacher"), asyncHandler(gradeController.save));

export default router;
