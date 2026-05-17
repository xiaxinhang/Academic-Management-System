import { success } from "../utils/response.js";
import * as enrollmentService from "../services/enrollmentService.js";

export async function list(req, res) {
  success(res, await enrollmentService.listEnrollments(req.query, req.user));
}

export async function create(req, res) {
  success(res, await enrollmentService.createEnrollment(req.body, req.user), "选课成功", 201);
}

export async function remove(req, res) {
  await enrollmentService.deleteEnrollment(req.params.id, req.user);
  success(res, null, "退课成功");
}
