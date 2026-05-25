import { pool } from "../db/pool.js";
import { getPagination } from "../utils/pagination.js";

export async function summary(user) {
  const teacherWhere = user.role === "teacher" ? " WHERE teacher = ?" : "";
  const teacherParams = user.role === "teacher" ? [user.username] : [];

  const [[courseCount]] = await pool.query(`SELECT COUNT(*) AS total FROM courses${teacherWhere}`, teacherParams);
  const [[studentCount]] = await pool.query("SELECT COUNT(*) AS total FROM students");
  let enrollCount = 0;
  let avgScore = 0;

  if (user.role === "student") {
    const [[myEnroll]] = await pool.query(
      "SELECT COUNT(*) AS total FROM enrollments WHERE student_id = ?",
      [user.studentId]
    );
    enrollCount = myEnroll.total;

    const [[weighted]] = await pool.query(
      `SELECT ROUND(
          COALESCE(SUM(g.score * c.credit) / NULLIF(SUM(c.credit), 0), 0),
          2
        ) AS avgScore
       FROM grades g
       JOIN courses c ON c.id = g.course_id
       WHERE g.student_id = ?`,
      [user.studentId]
    );
    avgScore = weighted.avgScore || 0;
  } else {
    const [[enroll]] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id${teacherWhere ? " WHERE c.teacher = ?" : ""}`,
      teacherParams
    );
    enrollCount = enroll.total;

    const [[gradeAvg]] = await pool.query(
      `SELECT ROUND(AVG(g.score), 2) AS avgScore
       FROM grades g
       JOIN courses c ON c.id = g.course_id${teacherWhere ? " WHERE c.teacher = ?" : ""}`,
      teacherParams
    );
    avgScore = gradeAvg.avgScore || 0;
  }

  return {
    courseCount: courseCount.total,
    studentCount: user.role === "admin" ? studentCount.total : null,
    enrollCount,
    avgScore
  };
}

export async function courseStats(user) {
  const where = user.role === "teacher" ? " WHERE c.teacher = ?" : "";
  const params = user.role === "teacher" ? [user.username] : [];
  const [rows] = await pool.query(
    `SELECT c.course_name, COUNT(e.id) AS selectedCount, ROUND(AVG(g.score), 2) AS avgScore
     FROM courses c
     LEFT JOIN enrollments e ON e.course_id = c.id
     LEFT JOIN grades g ON g.course_id = c.id${where}
     GROUP BY c.id, c.course_name
     ORDER BY selectedCount DESC, c.id ASC`,
    params
  );
  return rows;
}

export async function topCourses(user) {
  const stats = await courseStats(user);
  return stats.slice(0, 5);
}

export async function gradeDistribution(user) {
  const teacherJoin = user.role === "teacher" ? " JOIN courses c ON c.id = g.course_id WHERE c.teacher = ?" : "";
  const params = user.role === "teacher" ? [user.username] : [];
  const [rows] = await pool.query(
    `SELECT
       SUM(CASE WHEN g.score < 60 THEN 1 ELSE 0 END) AS fail,
       SUM(CASE WHEN g.score >= 60 AND g.score < 70 THEN 1 ELSE 0 END) AS pass,
       SUM(CASE WHEN g.score >= 70 AND g.score < 80 THEN 1 ELSE 0 END) AS medium,
       SUM(CASE WHEN g.score >= 80 AND g.score < 90 THEN 1 ELSE 0 END) AS good,
       SUM(CASE WHEN g.score >= 90 THEN 1 ELSE 0 END) AS excellent
     FROM grades g${teacherJoin}`,
    params
  );
  return rows[0];
}

export async function logTrend() {
  const [rows] = await pool.query(
    `SELECT DATE(created_at) AS date, COUNT(*) AS count
     FROM operation_logs
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
     GROUP BY DATE(created_at)
     ORDER BY DATE(created_at) ASC`
  );
  return rows;
}

export async function logs(query) {
  const { page, pageSize, offset } = getPagination(query);
  const [[countRow]] = await pool.query("SELECT COUNT(*) AS total FROM operation_logs");
  const [rows] = await pool.query(
    `SELECT l.id, l.action, l.target, l.detail, l.created_at, u.username
     FROM operation_logs l
     LEFT JOIN users u ON l.user_id = u.id
     ORDER BY l.id DESC
     LIMIT ? OFFSET ?`,
    [pageSize, offset]
  );
  return { list: rows, total: countRow.total, page, pageSize };
}
