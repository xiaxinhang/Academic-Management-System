import express from "express";
import { authRequired, adminOnly, roleRequired } from "../middleware.js";
import { asyncHandler } from "../utils/errors.js";
import * as studentController from "../controllers/studentController.js";

const router = express.Router();

router.get("/options", authRequired, roleRequired("admin", "teacher"), asyncHandler(studentController.options));
router.get("/export", authRequired, adminOnly, asyncHandler(studentController.exportCsv));
router.get("/", authRequired, adminOnly, asyncHandler(studentController.list));
router.post("/", authRequired, adminOnly, asyncHandler(studentController.create));
router.delete("/batch", authRequired, adminOnly, asyncHandler(studentController.batchRemove));
router.put("/:id", authRequired, adminOnly, asyncHandler(studentController.update));
router.delete("/:id", authRequired, adminOnly, asyncHandler(studentController.remove));

export default router;
