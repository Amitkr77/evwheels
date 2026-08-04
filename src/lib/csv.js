/**
 * Client-side CSV export — no server round-trip needed since the admin
 * report tabs already hold the full dataset in state by the time a user
 * wants to export it.
 */

function escapeCsvValue(value) {
  const str = value === null || value === undefined ? "" : String(value);
  // Quote any field containing a comma, quote, or newline; double up internal quotes.
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * @param {Array<object>} rows
 * @param {Array<{ label: string, key: string | ((row: object) => any) }>} columns
 */
export function toCSV(rows, columns) {
  const header = columns.map((c) => escapeCsvValue(c.label)).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => escapeCsvValue(typeof c.key === "function" ? c.key(row) : row[c.key]))
        .join(",")
    )
    .join("\n");
  return `${header}\n${body}`;
}

/**
 * Builds a CSV from rows/columns and triggers a browser download.
 */
export function downloadCSV(filename, rows, columns) {
  const csv = toCSV(rows, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
