import { success } from "../utils/response.js";
import { sendCsv } from "../utils/csv.js";
import * as studentService from "../services/studentService.js";

export async function list(req, res) {
  success(res, await studentService.listStudents(req.query));
}

export async function options(req, res) {
  success(res, await studentService.getStudentOptions());
}

export async function create(req, res) {
  success(res, await studentService.createStudent(req.body, req.user), "学生新增成功", 201);
}

export async function update(req, res) {
  success(res, await studentService.updateStudent(req.params.id, req.body, req.user), "学生更新成功");
}

export async function remove(req, res) {
  await studentService.deleteStudent(req.params.id, req.user);
  success(res, null, "学生删除成功");
}

export async function batchRemove(req, res) {
  success(res, await studentService.batchDeleteStudents(req.body.ids, req.user), "学生批量删除成功");
}

export async function exportCsv(req, res) {
  sendCsv(res, "students.csv", await studentService.exportStudents());
}
