import Link from "next/link";
import { getServerSession } from "next-auth";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main style={{ padding: "32px 0 56px" }}>
      <div className="shell">
        <section
          className="panel hero-grid"
          style={{
            borderRadius: "36px",
            padding: "2rem",
            overflow: "hidden"
          }}
        >
          <div style={{ gridColumn: "span 7", display: "grid", gap: "1.2rem", alignContent: "start" }}>
            <span className="chip" style={{ width: "fit-content" }}>
              Gmail mail merge, without browser extensions
            </span>
            <div>
              <h1 style={{ margin: 0, fontSize: "clamp(2.6rem, 6vw, 5.4rem)", lineHeight: 0.95 }}>
                Personal outreach, powered by your spreadsheet.
              </h1>
              <p style={{ margin: "1rem 0 0", maxWidth: "40rem", fontSize: "1.08rem", lineHeight: 1.7, color: "var(--muted)" }}>
                Connect Google, upload a CSV or Excel sheet, draft one polished email, and send individualized
                Gmail messages with placeholder tags like {"{{Name}}"} and {"{{Company}}"}.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
              {session ? (
                <Link className="btn btn-primary" href="/dashboard">
                  Open dashboard
                </Link>
              ) : (
                <GoogleSignInButton />
              )}
              <a className="btn btn-secondary" href="#how-it-works">
                See workflow
              </a>
            </div>
          </div>

          <div style={{ gridColumn: "span 5", display: "grid", gap: "1rem" }}>
            <div
              className="panel"
              style={{
                borderRadius: "28px",
                padding: "1.3rem",
                background: "var(--paper-strong)"
              }}
            >
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>What you get</p>
              <div style={{ display: "grid", gap: "0.9rem", marginTop: "1rem" }}>
                <div>
                  <strong>Google OAuth with offline access</strong>
                  <p style={{ margin: "0.25rem 0 0", color: "var(--muted)", lineHeight: 1.55 }}>
                    Refresh tokens keep long send sessions stable without reconnecting every few minutes.
                  </p>
                </div>
                <div>
                  <strong>CSV and Excel parsing in-browser</strong>
                  <p style={{ margin: "0.25rem 0 0", color: "var(--muted)", lineHeight: 1.55 }}>
                    Column headers become merge fields instantly, with a preview before anything is sent.
                  </p>
                </div>
                <div>
                  <strong>Test-send and full queue</strong>
                  <p style={{ margin: "0.25rem 0 0", color: "var(--muted)", lineHeight: 1.55 }}>
                    Verify the first row, then run the full throttled send and inspect a row-by-row report.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" style={{ padding: "2rem 0 0" }}>
          <div className="hero-grid">
            {[
              ["1", "Upload contacts", "Bring a CSV or XLSX file with columns for recipient email and merge variables."],
              ["2", "Compose once", "Write a rich HTML email and subject line with placeholders like {{Name}}."],
              ["3", "Send safely", "Run a test message first, then send sequentially with delay-based throttling."]
            ].map(([step, title, copy]) => (
              <article
                className="panel"
                key={step}
                style={{
                  gridColumn: "span 4",
                  borderRadius: "28px",
                  padding: "1.35rem"
                }}
              >
                <span className="chip">{step}</span>
                <h2 style={{ margin: "1rem 0 0.45rem", fontSize: "1.2rem" }}>{title}</h2>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
