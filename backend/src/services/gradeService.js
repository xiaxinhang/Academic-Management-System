import { pool } from "../db/pool.js";
import { AppError, assertRequired, assertScore } from "../utils/errors.js";
import { getPagination } from "../utils/pagination.js";
import { writeLog } from "../utils/log.js";

function gradeConditions(query, user) {
  const studentNo = (query.studentNo || "").trim();
  const keyword = (query.keyword || "").trim();
  const conditions = [];
  const params = [];

  if (user.role === "student") {
    conditions.push("s.id = ?");
    params.push(user.studentId);
  } else if (user.role === "teacher") {
    conditions.push("c.teacher = ?");
    params.push(user.username);
  }

  if (studentNo && user.role !== "student") {
    conditions.push("s.student_no = ?");
    params.push(studentNo);
  }

  if (keyword) {
    conditions.push("(s.student_no LIKE ? OR s.student_name LIKE ? OR c.course_code LIKE ? OR c.course_name LIKE ?)");
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }

  return {
    where: conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "",
    params
  };
}

export async function listGrades(query, user) {
  const { page, pageSize, offset } = getPagination(query);
  const { where, params } = gradeConditions(query, user);

  const [[countRow]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM grades g
     JOIN students s ON g.student_id = s.id
     JOIN courses c ON g.course_id = c.id${where}`,
    params
  );
  const [rows] = await pool.query(
    `SELECT g.id, s.id AS student_id, s.student_no, s.student_name,
            c.id AS course_id, c.course_code, c.course_name, g.score
     FROM grades g
     JOIN students s ON g.student_id = s.id
     JOIN courses c ON g.course_id = c.id${where}
     ORDER BY g.id DESC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );
  return { list: rows, total: countRow.total, page, pageSize };
}

async function ensureTeacherOwnsCourse(courseId, user) {
  if (user.role !== "teacher") return;
  const [[row]] = await pool.query("SELECT id FROM courses WHERE id = ? AND teacher = ? LIMIT 1", [courseId, user.username]);
  if (!row) throw new AppError("教师只能录入自己负责课程的成绩", 403);
}

export async function saveGrade(payload, user) {
  assertRequired(payload.studentId, "学生不能为空");
  assertRequired(payload.courseId, "课程不能为空");
  assertRequired(payload.score, "成绩不能为空");
  assertScore(payload.score);

  await ensureTeacherOwnsCourse(payload.courseId, user);

  const [[student]] = await pool.query("SELECT id FROM students WHERE id = ? LIMIT 1", [payload.studentId]);
  if (!student) throw new AppError("学生不存在", 404);
  const [[course]] = await pool.query("SELECT id FROM courses WHERE id = ? LIMIT 1", [payload.courseId]);
  if (!course) throw new AppError("课程不存在", 404);

  const [[exist]] = await pool.query(
    "SELECT id FROM grades WHERE student_id = ? AND course_id = ? LIMIT 1",
    [payload.studentId, payload.courseId]
  );

  if (exist) {
    await pool.query("UPDATE grades SET score = ? WHERE id = ?", [payload.score, exist.id]);
    await writeLog({ userId: user.id, action: "UPDATE", target: "GRADE", detail: `grade_id=${exist.id}` });
    return { id: exist.id };
  }

  const [result] = await pool.query(
    "INSERT INTO grades (student_id, course_id, score) VALUES (?, ?, ?)",
    [payload.studentId, payload.courseId, payload.score]
  );
  await writeLog({ userId: user.id, action: "CREATE", target: "GRADE", detail: `grade_id=${result.insertId}` });
  return { id: result.insertId };
}

export async function exportGrades(user) {
  const { where, params } = gradeConditions({}, user);
  const [rows] = await pool.query(
    `SELECT s.student_no, s.student_name, c.course_code, c.course_name, g.score
     FROM grades g
     JOIN students s ON g.student_id = s.id
     JOIN courses c ON g.course_id = c.id${where}
     ORDER BY g.id DESC`,
    params
  );
  return rows;
}

export async function gradeDistribution(user) {
  const teacherWhere = user.role === "teacher" ? " JOIN courses c ON c.id = g.course_id WHERE c.teacher = ?" : "";
  const params = user.role === "teacher" ? [user.username] : [];
  const [rows] = await pool.query(
    `SELECT
       SUM(CASE WHEN score < 60 THEN 1 ELSE 0 END) AS fail,
       SUM(CASE WHEN score >= 60 AND score < 70 THEN 1 ELSE 0 END) AS pass,
       SUM(CASE WHEN score >= 70 AND score < 80 THEN 1 ELSE 0 END) AS medium,
       SUM(CASE WHEN score >= 80 AND score < 90 THEN 1 ELSE 0 END) AS good,
       SUM(CASE WHEN score >= 90 THEN 1 ELSE 0 END) AS excellent
     FROM grades g${teacherWhere}`,
    params
  );
  return rows[0];
}

export async function courseAverage(user) {
  const where = user.role === "teacher" ? " WHERE c.teacher = ?" : "";
  const params = user.role === "teacher" ? [user.username] : [];
  const [rows] = await pool.query(
    `SELECT c.course_code, c.course_name, ROUND(AVG(g.score), 2) AS avgScore
     FROM courses c
     LEFT JOIN grades g ON g.course_id = c.id${where}
     GROUP BY c.id, c.course_code, c.course_name
     ORDER BY avgScore DESC, c.id DESC`,
    params
  );
  return rows;
}
