import express from "express";
import { pool } from "../db/pool.js";
import { authRequired, adminOnly } from "../middleware.js";
import { writeLog } from "../utils/log.js";

const router = express.Router();

router.get("/", authRequired, async (req, res) => {
  let sql = `SELECT e.id, s.student_no, s.student_name, c.course_code, c.course_name, e.enrolled_at
             FROM enrollments e
             JOIN students s ON e.student_id = s.id
             JOIN courses c ON e.course_id = c.id`;
  const params = [];

  if (req.user.role === "student") {
    sql += " WHERE s.id = ?";
    params.push(req.user.studentId);
  }

  sql += " ORDER BY e.id DESC";
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.post("/", authRequired, adminOnly, async (req, res) => {
  const { studentId, courseId } = req.body;
  if (!studentId || !courseId) return res.status(400).json({ message: "缺少 studentId 或 courseId" });

  const [exist] = await pool.query("SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?", [studentId, courseId]);
  if (exist.length > 0) return res.status(409).json({ message: "该学生已选该课程" });

  const [result] = await pool.query("INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)", [studentId, courseId]);
  await writeLog({ userId: req.user.id, action: "CREATE", target: "ENROLLMENT", detail: `enrollment_id=${result.insertId}` });
  res.status(201).json({ id: result.insertId });
});

router.delete("/:id", authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.query("DELETE FROM enrollments WHERE id = ?", [id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "选课记录不存在" });
  await writeLog({ userId: req.user.id, action: "DELETE", target: "ENROLLMENT", detail: `enrollment_id=${id}` });
  res.json({ message: "退课成功" });
});

export default router;
