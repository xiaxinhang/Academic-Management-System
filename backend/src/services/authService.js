import bcrypt from "bcrypt";
import { pool } from "../db/pool.js";
import { signToken } from "../middleware.js";
import { AppError } from "../utils/errors.js";
import { writeLog } from "../utils/log.js";

export async function login({ username, password }) {
  if (!username || !password) {
    throw new AppError("用户名和密码不能为空", 400);
  }

  const [rows] = await pool.query(
    "SELECT id, username, password_hash, role, student_id FROM users WHERE username = ? LIMIT 1",
    [username]
  );

  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError("用户名或密码错误", 401);
  }

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    studentId: user.student_id
  };
  const token = signToken(payload);

  await writeLog({ userId: user.id, action: "LOGIN", target: "AUTH", detail: "用户登录" });

  return { token, user: payload };
}
