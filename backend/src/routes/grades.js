import express from "express";
import { pool } from "../db/pool.js";
import { authRequired, adminOnly } from "../middleware.js";

const router = express.Router();

router.get("/", authRequired, async (req, res) => {
  const studentNo = (req.query.studentNo || "").trim();
  let sql = `SELECT g.id, s.student_no, s.student_name, c.course_code, c.course_name, g.score
             FROM grades g
             JOIN students s ON g.student_id = s.id
             JOIN courses c ON g.course_id = c.id`;
  const params = [];

  if (req.user.role === "student") {
    sql += " WHERE s.id = ?";
    params.push(req.user.studentId);
  } else if (studentNo) {
    sql += " WHERE s.student_no = ?";
    params.push(studentNo);
  }

  sql += " ORDER BY g.id DESC";
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.post("/", authRequired, adminOnly, async (req, res) => {
  const { studentId, courseId, score } = req.body;
  if (!studentId || !courseId || score === undefined) {
    return res.status(400).json({ message: "缺少必填字段" });
  }
  if (Number(score) < 0 || Number(score) > 100) {
    return res.status(400).json({ message: "成绩范围应在 0 到 100 之间" });
  }
  const [exist] = await pool.query("SELECT id FROM grades WHERE student_id = ? AND course_id = ?", [studentId, courseId]);
  if (exist.length > 0) {
    await pool.query("UPDATE grades SET score = ? WHERE id = ?", [score, exist[0].id]);
    return res.json({ message: "成绩更新成功" });
  }
  const [result] = await pool.query("INSERT INTO grades (student_id, course_id, score) VALUES (?, ?, ?)", [studentId, courseId, score]);
  res.status(201).json({ id: result.insertId });
});

export default router;
