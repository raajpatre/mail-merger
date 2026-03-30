import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { MailMergeWorkspace } from "@/components/mail-merge-workspace";
import { UserMenu } from "@/components/auth/user-menu";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <main style={{ padding: "28px 0 56px" }}>
      <div className="shell" style={{ display: "grid", gap: "1.5rem" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          <div>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem" }}>Authenticated workspace</p>
            <h1 style={{ margin: "0.35rem 0 0", fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>Mail merge dashboard</h1>
          </div>
          <UserMenu email={session.user?.email} />
        </header>

        <MailMergeWorkspace />
      </div>
    </main>
  );
}
