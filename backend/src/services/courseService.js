import { pool } from "../db/pool.js";
import { AppError, assertRequired } from "../utils/errors.js";
import { getPagination } from "../utils/pagination.js";
import { writeLog } from "../utils/log.js";

function validateCourse(payload) {
  assertRequired(payload.courseCode, "课程编号不能为空");
  assertRequired(payload.courseName, "课程名称不能为空");
  assertRequired(payload.teacher, "教师不能为空");
  assertRequired(payload.credit, "学分不能为空");
  assertRequired(payload.capacity, "课程容量不能为空");

  const credit = Number(payload.credit);
  const capacity = Number(payload.capacity);
  if (!Number.isInteger(credit) || credit < 1 || credit > 8) {
    throw new AppError("学分必须是 1 到 8 之间的整数", 400);
  }
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new AppError("课程容量必须是正整数", 400);
  }
}

function courseWhere({ keyword = "", user }) {
  const conditions = [];
  const params = [];

  if (keyword) {
    conditions.push("(course_code LIKE ? OR course_name LIKE ? OR teacher LIKE ?)");
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }

  if (user?.role === "teacher") {
    conditions.push("teacher = ?");
    params.push(user.username);
  }

  return {
    where: conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "",
    params
  };
}

export async function listCourses(query, user) {
  const { page, pageSize, offset } = getPagination(query);
  const keyword = (query.keyword || "").trim();
  const { where, params } = courseWhere({ keyword, user });

  const [[countRow]] = await pool.query(`SELECT COUNT(*) AS total FROM courses${where}`, params);
  const [rows] = await pool.query(
    `SELECT c.id, c.course_code, c.course_name, c.teacher, c.credit, c.capacity,
            COUNT(e.id) AS selected_count
     FROM courses c
     LEFT JOIN enrollments e ON e.course_id = c.id
     ${where.replaceAll("course_", "c.course_").replace("teacher", "c.teacher")}
     GROUP BY c.id
     ORDER BY c.id DESC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  return { list: rows, total: countRow.total, page, pageSize };
}

export async function getCourseOptions(user) {
  const { where, params } = courseWhere({ user });
  const [rows] = await pool.query(
    `SELECT id, course_code, course_name, capacity FROM courses${where} ORDER BY course_code ASC, id ASC`,
    params
  );
  return rows;
}

export async function createCourse(payload, user) {
  validateCourse(payload);
  try {
    const [result] = await pool.query(
      "INSERT INTO courses (course_code, course_name, teacher, credit, capacity) VALUES (?, ?, ?, ?, ?)",
      [payload.courseCode, payload.courseName, payload.teacher, Number(payload.credit), Number(payload.capacity)]
    );
    await writeLog({ userId: user.id, action: "CREATE", target: "COURSE", detail: `course_id=${result.insertId}` });
    return { id: result.insertId };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") throw new AppError("课程编号已存在", 409);
    throw err;
  }
}

export async function updateCourse(id, payload, user) {
  validateCourse(payload);
  try {
    const [result] = await pool.query(
      "UPDATE courses SET course_code = ?, course_name = ?, teacher = ?, credit = ?, capacity = ? WHERE id = ?",
      [payload.courseCode, payload.courseName, payload.teacher, Number(payload.credit), Number(payload.capacity), id]
    );
    if (!result.affectedRows) throw new AppError("课程不存在", 404);
    await writeLog({ userId: user.id, action: "UPDATE", target: "COURSE", detail: `course_id=${id}` });
    return { id: Number(id) };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") throw new AppError("课程编号已存在", 409);
    throw err;
  }
}

export async function deleteCourse(id, user) {
  const [result] = await pool.query("DELETE FROM courses WHERE id = ?", [id]);
  if (!result.affectedRows) throw new AppError("课程不存在", 404);
  await writeLog({ userId: user.id, action: "DELETE", target: "COURSE", detail: `course_id=${id}` });
}

export async function batchDeleteCourses(ids, user) {
  if (!Array.isArray(ids) || ids.length === 0) throw new AppError("请选择要删除的课程", 400);
  const safeIds = ids.map(Number).filter((id) => Number.isInteger(id) && id > 0);
  if (safeIds.length !== ids.length) throw new AppError("课程 ID 不合法", 400);

  const placeholders = safeIds.map(() => "?").join(",");
  const [result] = await pool.query(`DELETE FROM courses WHERE id IN (${placeholders})`, safeIds);
  await writeLog({ userId: user.id, action: "DELETE", target: "COURSE", detail: `batch_count=${result.affectedRows}` });
  return { deleted: result.affectedRows };
}

export async function exportCourses(user) {
  const { where, params } = courseWhere({ user });
  const [rows] = await pool.query(
    `SELECT course_code, course_name, teacher, credit, capacity FROM courses${where} ORDER BY id DESC`,
    params
  );
  return rows;
}
