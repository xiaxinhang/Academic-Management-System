import express from "express";
import { authRequired, adminOnly } from "../middleware.js";
import { asyncHandler } from "../utils/errors.js";
import * as dashboardController from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", authRequired, asyncHandler(dashboardController.summary));
router.get("/course-stats", authRequired, adminOnly, asyncHandler(dashboardController.courseStats));
router.get("/top-courses", authRequired, adminOnly, asyncHandler(dashboardController.topCourses));
router.get("/grade-distribution", authRequired, asyncHandler(dashboardController.gradeDistribution));
router.get("/log-trend", authRequired, adminOnly, asyncHandler(dashboardController.logTrend));
router.get("/logs", authRequired, adminOnly, asyncHandler(dashboardController.logs));

export default router;
