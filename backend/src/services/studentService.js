import { pool } from "../db/pool.js";
import { AppError, assertRequired } from "../utils/errors.js";
import { getPagination } from "../utils/pagination.js";
import { writeLog } from "../utils/log.js";

function validateStudent(payload) {
  assertRequired(payload.studentNo, "学号不能为空");
  assertRequired(payload.studentName, "学生姓名不能为空");
}

function buildWhere(keyword) {
  const params = [];
  let where = "";
  if (keyword) {
    where = " WHERE student_no LIKE ? OR student_name LIKE ? OR class_name LIKE ?";
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }
  return { where, params };
}

export async function listStudents(query) {
  const { page, pageSize, offset } = getPagination(query);
  const keyword = (query.keyword || "").trim();
  const { where, params } = buildWhere(keyword);
  const [[countRow]] = await pool.query(`SELECT COUNT(*) AS total FROM students${where}`, params);
  const [rows] = await pool.query(
    `SELECT id, student_no, student_name, class_name, grade_year
     FROM students${where}
     ORDER BY id DESC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );
  return { list: rows, total: countRow.total, page, pageSize };
}

export async function getStudentOptions() {
  const [rows] = await pool.query(
    "SELECT id, student_no, student_name FROM students ORDER BY student_no ASC, id ASC"
  );
  return rows;
}

export async function createStudent(payload, user) {
  validateStudent(payload);
  try {
    const [result] = await pool.query(
      "INSERT INTO students (student_no, student_name, class_name, grade_year) VALUES (?, ?, ?, ?)",
      [payload.studentNo, payload.studentName, payload.className || null, payload.gradeYear || null]
    );
    await writeLog({ userId: user.id, action: "CREATE", target: "STUDENT", detail: `student_id=${result.insertId}` });
    return { id: result.insertId };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") throw new AppError("学号已存在", 409);
    throw err;
  }
}

export async function updateStudent(id, payload, user) {
  validateStudent(payload);
  try {
    const [result] = await pool.query(
      "UPDATE students SET student_no = ?, student_name = ?, class_name = ?, grade_year = ? WHERE id = ?",
      [payload.studentNo, payload.studentName, payload.className || null, payload.gradeYear || null, id]
    );
    if (!result.affectedRows) throw new AppError("学生不存在", 404);
    await writeLog({ userId: user.id, action: "UPDATE", target: "STUDENT", detail: `student_id=${id}` });
    return { id: Number(id) };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") throw new AppError("学号已存在", 409);
    throw err;
  }
}

export async function deleteStudent(id, user) {
  const [result] = await pool.query("DELETE FROM students WHERE id = ?", [id]);
  if (!result.affectedRows) throw new AppError("学生不存在", 404);
  await writeLog({ userId: user.id, action: "DELETE", target: "STUDENT", detail: `student_id=${id}` });
}

export async function batchDeleteStudents(ids, user) {
  if (!Array.isArray(ids) || ids.length === 0) throw new AppError("请选择要删除的学生", 400);
  const safeIds = ids.map(Number).filter((id) => Number.isInteger(id) && id > 0);
  if (safeIds.length !== ids.length) throw new AppError("学生 ID 不合法", 400);

  const placeholders = safeIds.map(() => "?").join(",");
  const [result] = await pool.query(`DELETE FROM students WHERE id IN (${placeholders})`, safeIds);
  await writeLog({ userId: user.id, action: "DELETE", target: "STUDENT", detail: `batch_count=${result.affectedRows}` });
  return { deleted: result.affectedRows };
}

export async function exportStudents() {
  const [rows] = await pool.query(
    "SELECT student_no, student_name, class_name, grade_year FROM students ORDER BY id DESC"
  );
  return rows;
}
