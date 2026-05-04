import express from "express";
import { pool } from "../db/pool.js";
import { authRequired, adminOnly } from "../middleware.js";

const router = express.Router();

router.get("/", authRequired, async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.max(1, Math.min(50, Number(req.query.pageSize || 10)));
  const keyword = (req.query.keyword || "").trim();
  const offset = (page - 1) * pageSize;

  let where = "";
  const params = [];
  if (keyword) {
    where = " WHERE course_code LIKE ? OR course_name LIKE ? OR teacher LIKE ?";
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }

  const [totalRows] = await pool.query(`SELECT COUNT(*) AS total FROM courses${where}`, params);
  const [rows] = await pool.query(
    `SELECT id, course_code, course_name, teacher, credit FROM courses${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  res.json({ list: rows, total: totalRows[0].total, page, pageSize });
});

router.post("/", authRequired, adminOnly, async (req, res) => {
  const { courseCode, courseName, teacher, credit } = req.body;
  if (!courseCode || !courseName || !teacher || !credit) {
    return res.status(400).json({ message: "缺少必填字段" });
  }
  const [result] = await pool.query(
    "INSERT INTO courses (course_code, course_name, teacher, credit) VALUES (?, ?, ?, ?)",
    [courseCode, courseName, teacher, credit]
  );
  res.status(201).json({ id: result.insertId });
});

router.put("/:id", authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { courseCode, courseName, teacher, credit } = req.body;
  const [result] = await pool.query(
    "UPDATE courses SET course_code = ?, course_name = ?, teacher = ?, credit = ? WHERE id = ?",
    [courseCode, courseName, teacher, credit, id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ message: "课程不存在" });
  res.json({ message: "更新成功" });
});

router.delete("/:id", authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.query("DELETE FROM courses WHERE id = ?", [id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "课程不存在" });
  res.json({ message: "删除成功" });
});

export default router;
