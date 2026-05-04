import express from "express";
import { pool } from "../db/pool.js";
import { signToken } from "../middleware.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "用户名和密码不能为空" });
  }
  const [rows] = await pool.query(
    "SELECT id, username, password, role, student_id FROM users WHERE username = ? LIMIT 1",
    [username]
  );
  if (rows.length === 0 || rows[0].password !== password) {
    return res.status(401).json({ message: "用户名或密码错误" });
  }
  const user = rows[0];
  const token = signToken({ id: user.id, username: user.username, role: user.role, studentId: user.student_id });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role, studentId: user.student_id } });
});

export default router;
