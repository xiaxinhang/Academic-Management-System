import { success } from "../utils/response.js";
import * as dashboardService from "../services/dashboardService.js";

export async function summary(req, res) {
  success(res, await dashboardService.summary(req.user));
}

export async function courseStats(req, res) {
  success(res, await dashboardService.courseStats(req.user));
}

export async function topCourses(req, res) {
  success(res, await dashboardService.topCourses(req.user));
}

export async function gradeDistribution(req, res) {
  success(res, await dashboardService.gradeDistribution(req.user));
}

export async function logTrend(req, res) {
  success(res, await dashboardService.logTrend());
}

export async function logs(req, res) {
  success(res, await dashboardService.logs(req.query));
}
