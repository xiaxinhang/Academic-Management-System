import express from "express";
import { pool } from "../db/pool.js";
import { authRequired, adminOnly } from "../middleware.js";
import { writeLog } from "../utils/log.js";

const router = express.Router();

async function getStudentColumns() {
  const [rows] = await pool.query("SHOW COLUMNS FROM students");
  return new Set(rows.map((row) => row.Field));
}

router.get("/", authRequired, async (_, res) => {
  const columns = await getStudentColumns();
  const classNameField = columns.has("class_name") ? "class_name" : "NULL AS class_name";
  const gradeYearField = columns.has("grade_year") ? "grade_year" : "NULL AS grade_year";
  const [rows] = await pool.query(
    `SELECT id, student_no, student_name, ${classNameField}, ${gradeYearField} FROM students ORDER BY id DESC`
  );
  res.json(rows);
});

router.post("/", authRequired, adminOnly, async (req, res) => {
  const { studentNo, studentName, className, gradeYear } = req.body;
  if (!studentNo || !studentName) return res.status(400).json({ message: "缺少学生信息" });
  const columns = await getStudentColumns();
  const insertColumns = ["student_no", "student_name"];
  const values = [studentNo, studentName];

  if (columns.has("class_name")) {
    insertColumns.push("class_name");
    values.push(className || null);
  }
  if (columns.has("grade_year")) {
    insertColumns.push("grade_year");
    values.push(gradeYear || null);
  }

  const placeholders = insertColumns.map(() => "?").join(", ");
  const [ret] = await pool.query(
    `INSERT INTO students (${insertColumns.join(", ")}) VALUES (${placeholders})`,
    values
  );
  await writeLog({ userId: req.user.id, action: "CREATE", target: "STUDENT", detail: `student_id=${ret.insertId}` });
  res.status(201).json({ id: ret.insertId });
});

router.put("/:id", authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { studentNo, studentName, className, gradeYear } = req.body;
  const columns = await getStudentColumns();
  const assignments = ["student_no=?", "student_name=?"];
  const values = [studentNo, studentName];

  if (columns.has("class_name")) {
    assignments.push("class_name=?");
    values.push(className || null);
  }
  if (columns.has("grade_year")) {
    assignments.push("grade_year=?");
    values.push(gradeYear || null);
  }
  values.push(id);

  const [ret] = await pool.query(
    `UPDATE students SET ${assignments.join(", ")} WHERE id=?`,
    values
  );
  if (!ret.affectedRows) return res.status(404).json({ message: "学生不存在" });
  await writeLog({ userId: req.user.id, action: "UPDATE", target: "STUDENT", detail: `student_id=${id}` });
  res.json({ message: "更新成功" });
});

router.delete("/:id", authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  const [ret] = await pool.query("DELETE FROM students WHERE id=?", [id]);
  if (!ret.affectedRows) return res.status(404).json({ message: "学生不存在" });
  await writeLog({ userId: req.user.id, action: "DELETE", target: "STUDENT", detail: `student_id=${id}` });
  res.json({ message: "删除成功" });
});

export default router;
