"use client";

import { useMemo, useState } from "react";

import type { ParsedDataset } from "@/lib/file-parsers";
import { inferRecipientColumn } from "@/lib/file-parsers";
import { EmailEditor } from "@/components/composer/email-editor";
import { PlaceholderPanel } from "@/components/composer/placeholder-panel";
import { DataPreviewTable } from "@/components/uploads/data-preview-table";
import { FileUploader } from "@/components/uploads/file-uploader";

type SendMode = "test" | "all";

type SendResponse = {
  results: Array<{
    row: number;
    recipient: string;
    status: "success" | "failed";
    messageId?: string;
    reason?: string;
  }>;
};

const starterHtml = `
  <p>Hi {{Name}},</p>
  <p>I wanted to reach out about {{Company}} and share a quick idea that might help your team.</p>
  <p>Would you be open to a short chat this week?</p>
  <p>Best,<br />Raaj</p>
`;

function replacePlaceholders(template: string, row: Record<string, string>) {
  return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, key: string) => row[key.trim()] ?? "");
}

export function MailMergeWorkspace() {
  const [dataset, setDataset] = useState<ParsedDataset | null>(null);
  const [subject, setSubject] = useState("Quick note for {{Company}}");
  const [bodyHtml, setBodyHtml] = useState(starterHtml);
  const [recipientColumn, setRecipientColumn] = useState("Email");
  const [sendResults, setSendResults] = useState<SendResponse["results"]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const emailLikeHeaders = useMemo(() => {
    if (!dataset) {
      return [];
    }

    return dataset.headers.filter((header) => /email|mail/i.test(header));
  }, [dataset]);

  const firstRowPreview = useMemo(() => {
    if (!dataset?.rows[0]) {
      return null;
    }

    return {
      recipient: dataset.rows[0][recipientColumn] ?? "",
      subject: replacePlaceholders(subject, dataset.rows[0]),
      html: replacePlaceholders(bodyHtml, dataset.rows[0])
    };
  }, [bodyHtml, dataset, recipientColumn, subject]);

  async function handleSend(mode: SendMode) {
    if (!dataset) {
      setStatusMessage("Upload a CSV or Excel file before sending.");
      return;
    }

    setIsSending(true);
    setStatusMessage(mode === "test" ? "Sending a test email..." : "Sending personalized emails...");

    try {
      const response = await fetch("/api/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode,
          rows: dataset.rows,
          subject,
          html: bodyHtml,
          recipientColumn
        })
      });

      const payload = (await response.json()) as SendResponse & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to send emails");
      }

      setSendResults(payload.results);
      const successful = payload.results.filter((result) => result.status === "success").length;
      setStatusMessage(
        mode === "test"
          ? `Test email sent successfully to ${payload.results[0]?.recipient ?? "the first row"}.`
          : `Finished sending. ${successful} of ${payload.results.length} emails succeeded.`
      );
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to send emails");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <FileUploader
        onParsed={(parsedDataset) => {
          setDataset(parsedDataset);
          setSendResults([]);
          const inferredRecipientColumn = inferRecipientColumn(parsedDataset.headers);
          const hasEmailColumn = parsedDataset.headers.some((header) => /email|mail/i.test(header));

          setRecipientColumn(inferredRecipientColumn);
          setStatusMessage(
            hasEmailColumn
              ? `Loaded ${parsedDataset.rows.length} rows from ${parsedDataset.fileName}.`
              : `Loaded ${parsedDataset.rows.length} rows from ${parsedDataset.fileName}, but I could not find an obvious email column yet.`
          );
        }}
      />

      {dataset ? (
        <>
          <div className="workspace-grid" style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1.35fr 0.85fr" }}>
            <section
              className="panel"
              style={{
                borderRadius: "var(--radius-xl)",
                padding: "1.4rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>Step 3</p>
                  <h2 style={{ margin: "0.35rem 0 0", fontSize: "1.35rem" }}>Compose your message</h2>
                </div>
                <span className="chip">{dataset.fileName}</span>
              </div>

              <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                <label>
                  <span style={{ display: "block", marginBottom: "0.45rem", fontWeight: 600 }}>Recipient column</span>
                  <select
                    className="select"
                    onChange={(event) => setRecipientColumn(event.target.value)}
                    value={recipientColumn}
                  >
                    {dataset.headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span style={{ display: "block", marginBottom: "0.45rem", fontWeight: 600 }}>Subject line</span>
                  <input
                    className="field"
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Your subject with {{Placeholders}}"
                    value={subject}
                  />
                </label>

                <div>
                  <span style={{ display: "block", marginBottom: "0.45rem", fontWeight: 600 }}>Email body</span>
                  <EmailEditor onChange={setBodyHtml} value={bodyHtml} />
                </div>
              </div>
            </section>

            <div style={{ display: "grid", gap: "1.5rem", alignContent: "start" }}>
              <PlaceholderPanel headers={dataset.headers} />

              <section
                className="panel"
                style={{
                  borderRadius: "var(--radius-xl)",
                  padding: "1.4rem"
                }}
              >
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>Step 4</p>
                <h3 style={{ margin: "0.35rem 0 0", fontSize: "1.2rem" }}>Dispatch</h3>
                <p style={{ margin: "0.8rem 0 1rem", color: "var(--muted)", lineHeight: 1.55 }}>
                  Emails are throttled sequentially to stay friendly with Gmail API rate limits.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button className="btn btn-secondary" disabled={isSending} onClick={() => handleSend("test")} type="button">
                    Send test
                  </button>
                  <button className="btn btn-primary" disabled={isSending} onClick={() => handleSend("all")} type="button">
                    Send all
                  </button>
                </div>

                {emailLikeHeaders.length ? (
                  <p style={{ margin: "1rem 0 0", color: "var(--muted)" }}>
                    Suggested recipient columns: {emailLikeHeaders.join(", ")}
                  </p>
                ) : null}

                {statusMessage ? (
                  <p style={{ margin: "1rem 0 0", color: "var(--ink)", lineHeight: 1.55 }}>{statusMessage}</p>
                ) : null}
              </section>
            </div>
          </div>

          {firstRowPreview ? (
            <section
              className="panel"
              style={{
                borderRadius: "var(--radius-xl)",
                padding: "1.4rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>Preview</p>
                  <h3 style={{ margin: "0.35rem 0 0", fontSize: "1.2rem" }}>Row 1 personalization check</h3>
                </div>
                <span className="chip">{firstRowPreview.recipient || "No recipient selected yet"}</span>
              </div>

              <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                <div>
                  <p style={{ margin: "0 0 0.45rem", color: "var(--muted)", fontSize: "0.9rem" }}>Resolved subject</p>
                  <div className="panel" style={{ borderRadius: "var(--radius-md)", padding: "0.9rem 1rem", boxShadow: "none" }}>
                    {firstRowPreview.subject}
                  </div>
                </div>

                <div>
                  <p style={{ margin: "0 0 0.45rem", color: "var(--muted)", fontSize: "0.9rem" }}>Resolved body</p>
                  <div
                    className="panel"
                    style={{ borderRadius: "var(--radius-md)", padding: "1rem", boxShadow: "none", lineHeight: 1.65 }}
                    dangerouslySetInnerHTML={{ __html: firstRowPreview.html }}
                  />
                </div>
              </div>
            </section>
          ) : null}

          <DataPreviewTable headers={dataset.headers} rows={dataset.rows} />

          {sendResults.length ? (
            <section
              className="panel"
              style={{
                borderRadius: "var(--radius-xl)",
                padding: "1.4rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>Results</p>
                  <h3 style={{ margin: "0.35rem 0 0", fontSize: "1.2rem" }}>Per-row send summary</h3>
                </div>
                <span className="chip">{sendResults.length} processed</span>
              </div>
              <div className="table-wrap" style={{ marginTop: "1rem" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Recipient</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sendResults.map((result) => (
                      <tr key={`${result.row}-${result.recipient}`}>
                        <td>{result.row}</td>
                        <td>{result.recipient || "—"}</td>
                        <td>
                          <span className={`status-pill ${result.status}`}>
                            {result.status === "success" ? "Sent" : "Failed"}
                          </span>
                        </td>
                        <td>{result.reason ?? result.messageId ?? "Delivered via Gmail API"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
