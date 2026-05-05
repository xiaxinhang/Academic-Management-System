import express from "express";
import { pool } from "../db/pool.js";
import { authRequired, adminOnly } from "../middleware.js";

const router = express.Router();

router.get("/summary", authRequired, async (_, res) => {
  const [[courseCount]] = await pool.query("SELECT COUNT(*) AS total FROM courses");
  const [[studentCount]] = await pool.query("SELECT COUNT(*) AS total FROM students");
  const [[enrollCount]] = await pool.query("SELECT COUNT(*) AS total FROM enrollments");
  const [[gradeAvg]] = await pool.query("SELECT ROUND(AVG(score),2) AS avgScore FROM grades");
  res.json({
    courseCount: courseCount.total,
    studentCount: studentCount.total,
    enrollCount: enrollCount.total,
    avgScore: gradeAvg.avgScore || 0
  });
});

router.get("/course-stats", authRequired, async (_, res) => {
  const [rows] = await pool.query(
    `SELECT c.course_name, COUNT(e.id) AS selectedCount, ROUND(AVG(g.score),2) AS avgScore
     FROM courses c
     LEFT JOIN enrollments e ON e.course_id = c.id
     LEFT JOIN grades g ON g.course_id = c.id
     GROUP BY c.id, c.course_name
     ORDER BY selectedCount DESC, c.id ASC`
  );
  res.json(rows);
});

router.get("/logs", authRequired, adminOnly, async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.max(1, Math.min(50, Number(req.query.pageSize || 10)));
  const offset = (page - 1) * pageSize;
  const [countRows] = await pool.query("SELECT COUNT(*) AS total FROM operation_logs");
  const [rows] = await pool.query(
    `SELECT l.id, l.action, l.target, l.detail, l.created_at, u.username
     FROM operation_logs l
     LEFT JOIN users u ON l.user_id = u.id
     ORDER BY l.id DESC LIMIT ? OFFSET ?`,
    [pageSize, offset]
  );
  res.json({ list: rows, total: countRows[0].total, page, pageSize });
});

export default router;
