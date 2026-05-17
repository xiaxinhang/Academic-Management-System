export function success(res, data = null, message = "操作成功", status = 200) {
  return res.status(status).json({
    code: 0,
    message,
    data
  });
}

export function fail(res, code = 500, message = "服务器内部错误") {
  return res.status(code).json({
    code,
    message,
    data: null
  });
}
