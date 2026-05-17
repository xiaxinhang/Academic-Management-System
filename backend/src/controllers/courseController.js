import { success } from "../utils/response.js";
import { sendCsv } from "../utils/csv.js";
import * as courseService from "../services/courseService.js";

export async function list(req, res) {
  success(res, await courseService.listCourses(req.query, req.user));
}

export async function options(req, res) {
  success(res, await courseService.getCourseOptions(req.user));
}

export async function create(req, res) {
  success(res, await courseService.createCourse(req.body, req.user), "课程新增成功", 201);
}

export async function update(req, res) {
  success(res, await courseService.updateCourse(req.params.id, req.body, req.user), "课程更新成功");
}

export async function remove(req, res) {
  await courseService.deleteCourse(req.params.id, req.user);
  success(res, null, "课程删除成功");
}

export async function batchRemove(req, res) {
  success(res, await courseService.batchDeleteCourses(req.body.ids, req.user), "课程批量删除成功");
}

export async function exportCsv(req, res) {
  sendCsv(res, "courses.csv", await courseService.exportCourses(req.user));
}
