export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function assertRequired(value, message) {
  if (value === undefined || value === null || value === "") {
    throw new AppError(message, 400);
  }
}

export function assertScore(score) {
  const value = Number(score);
  if (Number.isNaN(value) || value < 0 || value > 100) {
    throw new AppError("成绩必须在 0 到 100 之间", 400);
  }
}
