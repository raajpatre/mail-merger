type DataPreviewTableProps = {
  headers: string[];
  rows: Array<Record<string, string>>;
};

export function DataPreviewTable({ headers, rows }: DataPreviewTableProps) {
  const previewRows = rows.slice(0, 6);

  return (
    <div
      className="panel"
      style={{
        borderRadius: "var(--radius-xl)",
        padding: "1.4rem"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>Step 2</p>
          <h2 style={{ margin: "0.35rem 0 0", fontSize: "1.35rem" }}>Preview merge data</h2>
        </div>
        <span className="chip">{rows.length} recipient rows</span>
      </div>

      <div className="table-wrap" style={{ marginTop: "1rem" }}>
        <table className="table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, index) => (
              <tr key={`preview-row-${index + 1}`}>
                {headers.map((header) => (
                  <td key={`${header}-${index + 1}`}>{row[header] || "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
