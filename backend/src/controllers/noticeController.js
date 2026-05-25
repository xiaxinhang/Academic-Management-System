import { success } from "../utils/response.js";
import * as noticeService from "../services/noticeService.js";

export async function listPublished(req, res) {
  success(res, await noticeService.listPublishedNotices());
}

export async function listAll(req, res) {
  success(res, await noticeService.listAllNotices());
}

export async function create(req, res) {
  success(res, await noticeService.createNotice(req.body, req.user), "通知发布成功", 201);
}

export async function update(req, res) {
  success(res, await noticeService.updateNotice(req.params.id, req.body, req.user), "通知更新成功");
}

export async function remove(req, res) {
  await noticeService.deleteNotice(req.params.id, req.user);
  success(res, null, "通知删除成功");
}
