import { pool } from "../db/pool.js";

export async function writeLog({ userId, action, target, detail = "" }) {
  try {
    await pool.query(
      "INSERT INTO operation_logs (user_id, action, target, detail) VALUES (?, ?, ?, ?)",
      [userId || null, action, target, detail]
    );
  } catch (err) {
    console.error("writeLog failed:", err.message);
  }
}
