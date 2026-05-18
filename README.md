# MailMerger

<p align="center">
  <em>Sign in with Google. Upload your contacts. Send personalised emails at scale.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="NextAuth" />
  <img src="https://img.shields.io/badge/Gmail_API-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail API" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TipTap-0A0A0A?style=for-the-badge&logoColor=white" alt="TipTap" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/raajpatre/mail-merger?style=for-the-badge&color=FFD700" alt="Stars" />
  <img src="https://img.shields.io/github/last-commit/raajpatre/mail-merger?style=for-the-badge&color=EA4335" alt="Last Commit" />
  <img src="https://img.shields.io/badge/Runs_Locally-No_Deploy_Needed-555555?style=for-the-badge" alt="Local" />
</p>

---

## 📸 Gallery

<table>
  <tr>
    <td align="center"><strong>Landing Page</strong></td>
    <td align="center"><strong>CSV Upload and Editor</strong></td>
  </tr>
  <tr>
    <td><img width="1512" height="860" alt="Screenshot 2026-05-18 at 10 42 35 AM" src="https://github.com/user-attachments/assets/1204531f-039d-4fa7-93ca-14feca0fd335" /></td>
    <td><img width="1512" height="862" alt="Screenshot 2026-05-18 at 10 45 15 AM" src="https://github.com/user-attachments/assets/6aa5bfa4-2671-4c9a-899f-c1e37966f327" />
</td>
  </tr>
  <tr>
    <td align="center" col="2"><strong>Mail Preview</strong></td>
    <td></td>
  </tr>
  <tr>
    <td><img width="1512" height="862" alt="Screenshot 2026-05-18 at 10 45 40 AM" src="https://github.com/user-attachments/assets/f6e3b0aa-9fab-4e25-8f64-9cfc79da72a7" /></td>
    <td></td>
  </tr>
</table>

---

## 📖 Overview

**MailMerger** is a locally-run mail merge tool built on the Gmail API. Upload a spreadsheet of contacts, write one email template using `{{column_name}}` placeholders, preview how each row personalises the message, and send the full batch — each email composed and dispatched as a genuine personalised send.

No third-party email service. No SaaS subscription. You authenticate directly with your Google account, and emails go out through Gmail — so they arrive from your real address, with your real sending history, not a bulk-mail domain.

---

## ✨ Features

- **Google OAuth sign-in** with `gmail.send` scope and offline refresh tokens — authenticate once, send any time
- **CSV and Excel upload** with automatic column header extraction — any spreadsheet column becomes a `{{placeholder}}`
- **Rich text email editor** (TipTap) — write HTML emails with bold, links, lists, and inline formatting
- **Placeholder-driven personalisation** — subject line and body both support `{{column_name}}` tokens substituted per row
- **Row-by-row preview** — inspect exactly how each contact's email will look before sending
- **Test send** — send a draft to yourself first to verify formatting in a real inbox
- **Throttled batch send** — sequential sending with configurable delay and per-row success / failure reporting

---

## 🛠️ Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server Actions for Gmail API calls without a separate backend |
| Auth | NextAuth.js + Google OAuth | Offline refresh tokens, secure session handling |
| Email | `googleapis` (Gmail API) | Sends from user's real Gmail account, not a third-party relay |
| Rich text | TipTap | Headless, extensible, produces clean HTML output |
| CSV/Excel | PapaParse + `xlsx` | Handles both formats, auto-extracts column headers |
| Styling | Tailwind CSS + custom CSS | Utility-first with minimal overrides |
| Language | TypeScript | End-to-end type safety |

---

## 🚀 Local Setup

MailMerger runs locally — the Gmail OAuth callback requires a `localhost` redirect URI, so it doesn't suit a serverless public deployment.

### Prerequisites

- Node.js 18+
- A Google Cloud project with OAuth credentials

### 1. Clone and install

```bash
git clone https://github.com/raajpatre/mail-merger.git
cd mail-merger
npm install
```

### 2. Generate your local env file

```bash
npm run setup:local
```

This creates `.env.local` from `.env.example` and generates a `NEXTAUTH_SECRET` for you.

### 3. Add your Google OAuth credentials

Open `.env.local` and replace the two placeholder values:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generated-by-setup-script

GOOGLE_CLIENT_ID=your-client-id-from-google-cloud
GOOGLE_CLIENT_SECRET=your-client-secret-from-google-cloud
```

To get those values:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials
3. Create an **OAuth 2.0 Client ID** (Web application type)
4. Add `http://localhost:3000/api/auth/callback/google` as an Authorised Redirect URI
5. Enable the **Gmail API** on your project
6. Download the credentials JSON and extract `client_id` and `client_secret`

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in with Google, and start merging.

---

## 📋 Using MailMerger

1. **Sign in** with the Google account you want to send from
2. **Upload** a CSV or Excel file — every column becomes an available placeholder
3. **Compose** your email in the rich text editor using `{{column_name}}` placeholders
4. **Preview** each row to verify personalisation looks correct
5. **Test send** one email to yourself
6. **Send all** — MailMerger sends sequentially and reports success or failure per row

---

## ⚠️ Gmail API Limits

Gmail's default sending quota is 500 emails per day for personal accounts, 2,000 per day for Google Workspace accounts. MailMerger's throttled sequential sender stays within these limits for typical use cases. If you need higher volume, use a Workspace account.

---

## 📄 License

MIT — fork, adapt, and run it yourself.

---

<p align="center">
  If this saved you from manually personalising 200 emails, consider dropping a ⭐
</p>

<p align="center">
  <em>Built by <a href="https://github.com/raajpatre">raajpatre</a></em>
</p>
