import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { sendMailMerge } from "@/lib/gmail";

const payloadSchema = z.object({
  mode: z.enum(["test", "all"]),
  recipientColumn: z.string().min(1),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().min(1, "Email body is required"),
  rows: z.array(z.record(z.string())).min(1, "At least one data row is required")
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken || !session.refreshToken) {
      return NextResponse.json(
        {
          error: "Google session is missing Gmail credentials. Sign out and reconnect Google."
        },
        { status: 401 }
      );
    }

    const json = await request.json();
    const payload = payloadSchema.parse(json);

    const results = await sendMailMerge({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      subjectTemplate: payload.subject,
      htmlTemplate: payload.html,
      rows: payload.rows,
      recipientColumn: payload.recipientColumn,
      mode: payload.mode,
      fromEmail: session.user?.email ?? undefined
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Mail send route failed", error);

    const message =
      error instanceof Error ? error.message : "Unexpected error while dispatching emails";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
