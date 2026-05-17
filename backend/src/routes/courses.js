import express from "express";
import { authRequired, adminOnly } from "../middleware.js";
import { asyncHandler } from "../utils/errors.js";
import * as courseController from "../controllers/courseController.js";

const router = express.Router();

router.get("/options", authRequired, asyncHandler(courseController.options));
router.get("/export", authRequired, asyncHandler(courseController.exportCsv));
router.get("/", authRequired, asyncHandler(courseController.list));
router.post("/", authRequired, adminOnly, asyncHandler(courseController.create));
router.delete("/batch", authRequired, adminOnly, asyncHandler(courseController.batchRemove));
router.put("/:id", authRequired, adminOnly, asyncHandler(courseController.update));
router.delete("/:id", authRequired, adminOnly, asyncHandler(courseController.remove));

export default router;
