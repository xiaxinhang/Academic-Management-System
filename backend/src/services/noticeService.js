import { pool } from "../db/pool.js";
import { AppError, assertRequired } from "../utils/errors.js";
import { writeLog } from "../utils/log.js";

export async function listPublishedNotices() {
  const [rows] = await pool.query(
    `SELECT id, title, link_url, summary, created_at
     FROM notices
     WHERE is_published = 1
     ORDER BY id DESC
     LIMIT 50`
  );
  return rows;
}

export async function listAllNotices() {
  const [rows] = await pool.query(
    `SELECT id, title, link_url, summary, is_published, created_at, updated_at
     FROM notices
     ORDER BY id DESC
     LIMIT 200`
  );
  return rows;
}

function validateNotice(payload) {
  assertRequired(payload.title, "通知标题不能为空");
  assertRequired(payload.linkUrl, "通知链接不能为空");
}

export async function createNotice(payload, user) {
  validateNotice(payload);
  const [result] = await pool.query(
    `INSERT INTO notices (title, link_url, summary, is_published)
     VALUES (?, ?, ?, ?)`,
    [payload.title, payload.linkUrl, payload.summary || "", payload.isPublished === false ? 0 : 1]
  );
  await writeLog({ userId: user.id, action: "CREATE", target: "NOTICE", detail: `notice_id=${result.insertId}` });
  return { id: result.insertId };
}

export async function updateNotice(id, payload, user) {
  validateNotice(payload);
  const [result] = await pool.query(
    `UPDATE notices
     SET title = ?, link_url = ?, summary = ?, is_published = ?
     WHERE id = ?`,
    [payload.title, payload.linkUrl, payload.summary || "", payload.isPublished === false ? 0 : 1, id]
  );
  if (!result.affectedRows) throw new AppError("通知不存在", 404);
  await writeLog({ userId: user.id, action: "UPDATE", target: "NOTICE", detail: `notice_id=${id}` });
  return { id: Number(id) };
}

export async function deleteNotice(id, user) {
  const [result] = await pool.query("DELETE FROM notices WHERE id = ?", [id]);
  if (!result.affectedRows) throw new AppError("通知不存在", 404);
  await writeLog({ userId: user.id, action: "DELETE", target: "NOTICE", detail: `notice_id=${id}` });
}
