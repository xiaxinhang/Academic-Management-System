import { pool } from "../db/pool.js";
import { AppError, assertRequired } from "../utils/errors.js";
import { getPagination } from "../utils/pagination.js";
import { writeLog } from "../utils/log.js";

export async function listEnrollments(query, user) {
  const { page, pageSize, offset } = getPagination(query);
  const keyword = (query.keyword || "").trim();
  const conditions = [];
  const params = [];

  if (user.role === "student") {
    conditions.push("s.id = ?");
    params.push(user.studentId);
  }
  if (keyword) {
    conditions.push("(s.student_no LIKE ? OR s.student_name LIKE ? OR c.course_code LIKE ? OR c.course_name LIKE ?)");
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }

  const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "";
  const [[countRow]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM enrollments e
     JOIN students s ON e.student_id = s.id
     JOIN courses c ON e.course_id = c.id${where}`,
    params
  );
  const [rows] = await pool.query(
    `SELECT e.id, s.id AS student_id, s.student_no, s.student_name,
            c.id AS course_id, c.course_code, c.course_name, e.enrolled_at
     FROM enrollments e
     JOIN students s ON e.student_id = s.id
     JOIN courses c ON e.course_id = c.id${where}
     ORDER BY e.id DESC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  return { list: rows, total: countRow.total, page, pageSize };
}

export async function createEnrollment(payload, user) {
  const studentId = user.role === "student" ? user.studentId : payload.studentId;
  const courseId = payload.courseId;
  assertRequired(studentId, "学生不能为空");
  assertRequired(courseId, "课程不能为空");

  const [[student]] = await pool.query("SELECT id FROM students WHERE id = ? LIMIT 1", [studentId]);
  if (!student) throw new AppError("学生不存在", 404);

  const [[course]] = await pool.query("SELECT id, capacity FROM courses WHERE id = ? LIMIT 1", [courseId]);
  if (!course) throw new AppError("课程不存在", 404);

  const [[exist]] = await pool.query(
    "SELECT id FROM enrollments WHERE student_id = ? AND course_id = ? LIMIT 1",
    [studentId, courseId]
  );
  if (exist) throw new AppError("该学生已选该课程", 409);

  const [[countRow]] = await pool.query(
    "SELECT COUNT(*) AS total FROM enrollments WHERE course_id = ?",
    [courseId]
  );
  if (Number(countRow.total) >= Number(course.capacity)) {
    throw new AppError("课程容量已满", 409);
  }

  const [result] = await pool.query(
    "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)",
    [studentId, courseId]
  );
  await writeLog({ userId: user.id, action: "ENROLL", target: "ENROLLMENT", detail: `enrollment_id=${result.insertId}` });
  return { id: result.insertId };
}

export async function deleteEnrollment(id, user) {
  const [[row]] = await pool.query("SELECT student_id FROM enrollments WHERE id = ? LIMIT 1", [id]);
  if (!row) throw new AppError("选课记录不存在", 404);
  if (user.role === "student" && Number(row.student_id) !== Number(user.studentId)) {
    throw new AppError("只能退选自己的课程", 403);
  }

  await pool.query("DELETE FROM enrollments WHERE id = ?", [id]);
  await writeLog({ userId: user.id, action: "DROP", target: "ENROLLMENT", detail: `enrollment_id=${id}` });
}
