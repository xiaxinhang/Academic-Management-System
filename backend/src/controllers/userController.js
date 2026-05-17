import { success } from "../utils/response.js";
import * as userService from "../services/userService.js";

export async function list(req, res) {
  success(res, await userService.listUsers());
}

export async function create(req, res) {
  success(res, await userService.createUser(req.body, req.user), "用户新增成功", 201);
}

export async function update(req, res) {
  success(res, await userService.updateUser(req.params.id, req.body, req.user), "用户更新成功");
}

export async function remove(req, res) {
  await userService.deleteUser(req.params.id, req.user);
  success(res, null, "用户删除成功");
}
