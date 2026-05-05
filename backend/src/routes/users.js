import express from "express";
import { pool } from "../db/pool.js";
import { authRequired, adminOnly } from "../middleware.js";
import { writeLog } from "../utils/log.js";

const router = express.Router();

router.get("/", authRequired, adminOnly, async (_, res) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.role, u.student_id, s.student_name
     FROM users u
     LEFT JOIN students s ON s.id = u.student_id
     ORDER BY u.id DESC`
  );
  res.json(rows);
});

router.post("/", authRequired, adminOnly, async (req, res) => {
  const { username, password, role, studentId } = req.body;
  if (!username || !password || !role) return res.status(400).json({ message: "缺少用户信息" });
  const [ret] = await pool.query(
    "INSERT INTO users (username, password, role, student_id) VALUES (?, ?, ?, ?)",
    [username, password, role, role === "student" ? studentId || null : null]
  );
  await writeLog({ userId: req.user.id, action: "CREATE", target: "USER", detail: `user_id=${ret.insertId}` });
  res.status(201).json({ id: ret.insertId });
});

router.put("/:id", authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { password, role, studentId } = req.body;
  const [ret] = await pool.query(
    "UPDATE users SET password=?, role=?, student_id=? WHERE id=?",
    [password, role, role === "student" ? studentId || null : null, id]
  );
  if (!ret.affectedRows) return res.status(404).json({ message: "用户不存在" });
  await writeLog({ userId: req.user.id, action: "UPDATE", target: "USER", detail: `user_id=${id}` });
  res.json({ message: "更新成功" });
});

router.delete("/:id", authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  const [ret] = await pool.query("DELETE FROM users WHERE id=?", [id]);
  if (!ret.affectedRows) return res.status(404).json({ message: "用户不存在" });
  await writeLog({ userId: req.user.id, action: "DELETE", target: "USER", detail: `user_id=${id}` });
  res.json({ message: "删除成功" });
});

export default router;
