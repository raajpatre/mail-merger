"use client";

type PlaceholderPanelProps = {
  headers: string[];
};

export function PlaceholderPanel({ headers }: PlaceholderPanelProps) {
  return (
    <aside
      className="panel"
      style={{
        borderRadius: "var(--radius-xl)",
        padding: "1.4rem"
      }}
    >
      <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>Available placeholders</p>
      <h3 style={{ margin: "0.35rem 0 0", fontSize: "1.2rem" }}>Merge fields</h3>
      <p style={{ margin: "0.8rem 0 1rem", color: "var(--muted)", lineHeight: 1.55 }}>
        Use these exact tags in the subject or body. They will be replaced row by row when sending.
      </p>

      <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
        {headers.map((header) => (
          <code className="placeholder-tag" key={header}>
            {`{{${header}}}`}
          </code>
        ))}
      </div>
    </aside>
  );
}
