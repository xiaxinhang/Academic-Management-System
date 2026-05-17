export function getPagination(query) {
  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.max(1, Math.min(100, Number(query.pageSize || 10)));
  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize
  };
}
