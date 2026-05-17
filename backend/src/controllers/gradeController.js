import { success } from "../utils/response.js";
import { sendCsv } from "../utils/csv.js";
import * as gradeService from "../services/gradeService.js";

export async function list(req, res) {
  success(res, await gradeService.listGrades(req.query, req.user));
}

export async function save(req, res) {
  success(res, await gradeService.saveGrade(req.body, req.user), "成绩保存成功", 201);
}

export async function exportCsv(req, res) {
  sendCsv(res, "grades.csv", await gradeService.exportGrades(req.user));
}

export async function distribution(req, res) {
  success(res, await gradeService.gradeDistribution(req.user));
}

export async function averages(req, res) {
  success(res, await gradeService.courseAverage(req.user));
}
