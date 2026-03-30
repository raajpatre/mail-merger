import { google } from "googleapis";
import MailComposer from "nodemailer/lib/mail-composer";

export type MailMergeRow = Record<string, string | number | null | undefined>;

export type MailMergeResult = {
  row: number;
  recipient: string;
  status: "success" | "failed";
  messageId?: string;
  reason?: string;
};

export type SendMailMergeInput = {
  accessToken: string;
  refreshToken: string;
  subjectTemplate: string;
  htmlTemplate: string;
  rows: MailMergeRow[];
  recipientColumn?: string;
  mode?: "test" | "all";
  fromEmail?: string;
  delayMs?: number;
};

const DEFAULT_DELAY_MS = 750;
const DEFAULT_RECIPIENT_COLUMN = "Email";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function replacePlaceholders(template: string, row: MailMergeRow) {
  return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, key: string) => {
    const value = row[key.trim()];
    return value == null ? "" : String(value);
  });
}

function encodeMessage(message: string) {
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function normalizeSubject(subject: string) {
  return subject.replace(/^subject:\s*/i, "").trim();
}

function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function buildMimeMessage({
  fromEmail,
  to,
  subject,
  html
}: {
  fromEmail?: string;
  to: string;
  subject: string;
  html: string;
}) {
  const normalizedSubject = normalizeSubject(subject);
  const plainText = stripHtml(html);
  const composer = new MailComposer({
    from: fromEmail,
    to,
    subject: normalizedSubject,
    text: plainText,
    html,
    textEncoding: "base64"
  });

  const message = await composer.compile().build();
  return message.toString("utf8");
}

async function getAuthorizedClient(accessToken: string, refreshToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  await oauth2Client.getAccessToken();

  return oauth2Client;
}

async function sendSingleEmail(params: {
  gmail: ReturnType<typeof google.gmail>;
  fromEmail?: string;
  to: string;
  subject: string;
  html: string;
}) {
  const mimeMessage = await buildMimeMessage(params);
  const raw = encodeMessage(mimeMessage);

  return params.gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw
    }
  });
}

export async function sendMailMerge({
  accessToken,
  refreshToken,
  subjectTemplate,
  htmlTemplate,
  rows,
  recipientColumn = DEFAULT_RECIPIENT_COLUMN,
  mode = "all",
  fromEmail,
  delayMs = DEFAULT_DELAY_MS
}: SendMailMergeInput): Promise<MailMergeResult[]> {
  const client = await getAuthorizedClient(accessToken, refreshToken);
  const gmail = google.gmail({ version: "v1", auth: client });
  const targetRows = mode === "test" ? rows.slice(0, 1) : rows;
  const results: MailMergeResult[] = [];

  for (const [index, row] of targetRows.entries()) {
    const recipient = String(row[recipientColumn] ?? "").trim();

    if (!recipient) {
      results.push({
        row: index + 1,
        recipient,
        status: "failed",
        reason: `Missing recipient in "${recipientColumn}" column`
      });
      continue;
    }

    try {
      const subject = replacePlaceholders(subjectTemplate, row);
      const html = replacePlaceholders(htmlTemplate, row);

      const response = await sendSingleEmail({
        gmail,
        fromEmail,
        to: recipient,
        subject,
        html
      });

      results.push({
        row: index + 1,
        recipient,
        status: "success",
        messageId: response.data.id ?? undefined
      });
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : "Unknown Gmail API sending error";

      console.error(`Failed to send row ${index + 1} to ${recipient}`, error);

      results.push({
        row: index + 1,
        recipient,
        status: "failed",
        reason
      });
    }

    if (index < targetRows.length - 1) {
      await sleep(delayMs);
    }
  }

  return results;
}
