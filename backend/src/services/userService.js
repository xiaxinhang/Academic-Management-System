import bcrypt from "bcrypt";
import { pool } from "../db/pool.js";
import { AppError, assertRequired } from "../utils/errors.js";
import { writeLog } from "../utils/log.js";

const VALID_ROLES = new Set(["admin", "student", "teacher"]);

function validateUser(payload, isCreate = true) {
  if (isCreate) {
    assertRequired(payload.username, "用户名不能为空");
    assertRequired(payload.password, "密码不能为空");
  }
  assertRequired(payload.role, "角色不能为空");
  if (!VALID_ROLES.has(payload.role)) throw new AppError("角色不合法", 400);
  if (payload.role === "student") assertRequired(payload.studentId, "学生角色必须绑定学生");
}

export async function listUsers() {
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.role, u.student_id, s.student_name
     FROM users u
     LEFT JOIN students s ON s.id = u.student_id
     ORDER BY u.id DESC`
  );
  return rows;
}

export async function createUser(payload, user) {
  validateUser(payload, true);
  const passwordHash = await bcrypt.hash(payload.password, 10);
  try {
    const [result] = await pool.query(
      "INSERT INTO users (username, password_hash, role, student_id) VALUES (?, ?, ?, ?)",
      [payload.username, passwordHash, payload.role, payload.role === "student" ? payload.studentId : null]
    );
    await writeLog({ userId: user.id, action: "CREATE", target: "USER", detail: `user_id=${result.insertId}` });
    return { id: result.insertId };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") throw new AppError("用户名已存在", 409);
    throw err;
  }
}

export async function updateUser(id, payload, user) {
  validateUser(payload, false);
  const values = [payload.role, payload.role === "student" ? payload.studentId : null];
  let passwordSql = "";

  if (payload.password) {
    passwordSql = ", password_hash = ?";
    values.push(await bcrypt.hash(payload.password, 10));
  }

  values.push(id);
  const [result] = await pool.query(
    `UPDATE users SET role = ?, student_id = ?${passwordSql} WHERE id = ?`,
    values
  );

  if (!result.affectedRows) throw new AppError("用户不存在", 404);
  await writeLog({ userId: user.id, action: "UPDATE", target: "USER", detail: `user_id=${id}` });
  return { id: Number(id) };
}

export async function deleteUser(id, user) {
  if (Number(id) === Number(user.id)) throw new AppError("不能删除当前登录用户", 400);
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  if (!result.affectedRows) throw new AppError("用户不存在", 404);
  await writeLog({ userId: user.id, action: "DELETE", target: "USER", detail: `user_id=${id}` });
}
