export function sendCsv(res, filename, rows) {
  const headers = Object.keys(rows[0] || {});
  const escapeCell = (value) => {
    const text = value === null || value === undefined ? "" : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };
  const body = [
    headers.join(","),
    ...rows.map((row) => headers.map((key) => escapeCell(row[key])).join(","))
  ].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  return res.send(`\uFEFF${body}`);
}
