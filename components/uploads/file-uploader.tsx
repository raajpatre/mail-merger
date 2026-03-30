"use client";

import { useRef, useState } from "react";

import type { ParsedDataset } from "@/lib/file-parsers";
import { parseSpreadsheet } from "@/lib/file-parsers";

type FileUploaderProps = {
  onParsed: (dataset: ParsedDataset) => void;
};

export function FileUploader({ onParsed }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setIsParsing(true);

    try {
      const dataset = await parseSpreadsheet(file);

      if (!dataset.headers.length || !dataset.rows.length) {
        throw new Error("The uploaded file did not contain any data rows.");
      }

      onParsed(dataset);
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : "Unable to parse file");
    } finally {
      setIsParsing(false);
    }
  }

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
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>Step 1</p>
          <h2 style={{ margin: "0.35rem 0 0", fontSize: "1.35rem" }}>Upload a data source</h2>
        </div>
        <button className="btn btn-secondary" onClick={() => inputRef.current?.click()} type="button">
          {isParsing ? "Parsing..." : "Choose CSV or XLSX"}
        </button>
      </div>

      <p style={{ margin: "0.85rem 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
        Import the spreadsheet you want to merge against. Column headers become placeholders like
        {" "}
        <span className="placeholder-tag">{"{{Company}}"}</span>
        {" "}
        and
        {" "}
        <span className="placeholder-tag">{"{{Email}}"}</span>.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
        <a className="btn btn-ghost" download href="/sample-contacts.csv">
          Download sample CSV
        </a>
        <span className="chip">Include at least one email-like column</span>
      </div>

      <input
        accept=".csv,.xlsx,.xls"
        hidden
        onChange={handleFileChange}
        ref={inputRef}
        type="file"
      />

      {error ? (
        <p style={{ color: "var(--danger)", margin: "0.95rem 0 0" }}>{error}</p>
      ) : null}
    </div>
  );
}
