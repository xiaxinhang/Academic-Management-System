import express from "express";
import { authRequired, adminOnly } from "../middleware.js";
import { asyncHandler } from "../utils/errors.js";
import * as noticeController from "../controllers/noticeController.js";

const router = express.Router();

router.get("/", authRequired, asyncHandler(noticeController.listPublished));
router.get("/admin", authRequired, adminOnly, asyncHandler(noticeController.listAll));
router.post("/", authRequired, adminOnly, asyncHandler(noticeController.create));
router.put("/:id", authRequired, adminOnly, asyncHandler(noticeController.update));
router.delete("/:id", authRequired, adminOnly, asyncHandler(noticeController.remove));

export default router;
