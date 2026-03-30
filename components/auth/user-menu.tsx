"use client";

import { signOut } from "next-auth/react";

export function UserMenu({ email }: { email?: string | null }) {
  return (
    <div
      className="panel"
      style={{
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.45rem 0.55rem 0.45rem 1rem"
      }}
    >
      <span style={{ color: "var(--muted)", fontSize: "0.92rem" }}>{email ?? "Signed in"}</span>
      <button className="btn btn-ghost" onClick={() => signOut({ callbackUrl: "/" })} type="button">
        Sign out
      </button>
    </div>
  );
}
