import { success } from "../utils/response.js";
import * as authService from "../services/authService.js";

export async function login(req, res) {
  const data = await authService.login(req.body);
  success(res, data, "登录成功");
}
