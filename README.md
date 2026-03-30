# MailMerger

MailMerger is a local-first mail merge app built with Next.js, NextAuth, Google OAuth, and the Gmail API. A user can sign in with Google, upload a CSV or Excel file, compose a templated email with placeholders, preview row-one personalization, and send a test email or a throttled full batch.

## Features

- Google sign-in with `gmail.send` scope and offline refresh tokens
- CSV and Excel upload with automatic column header extraction
- Rich text email editor with hyperlinks
- Placeholder-driven personalization for subject and body
- Test send and send-all flows
- Sequential sending with per-row success and failure reporting

## Tech Stack

- Next.js App Router
- React
- Tailwind-ready styling with custom CSS
- NextAuth.js
- `googleapis`
- TipTap
- Papa Parse and `xlsx`

## Local Setup

### 1. Clone and install

```bash
npm install
```

### 2. Generate your local env file

```bash
npm run setup:local
```

This creates `.env.local` from `.env.example` and generates a `NEXTAUTH_SECRET` for you.

### 3. Add your Google OAuth credentials

Open `.env.local` and replace:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### 4. Configure Google Cloud

In your Google Cloud project:

- Enable the Gmail API
- Configure the OAuth consent screen
- Add the Gmail scope:
  `https://www.googleapis.com/auth/gmail.send`
- Add your local user as a test user if the app is in testing mode
- Add this redirect URI to the OAuth client:
  `http://localhost:3000/api/auth/callback/google`

### 5. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Typical Workflow

1. Sign in with Google
2. Upload a `.csv` or `.xlsx` file
3. Pick the recipient column
4. Write a subject and HTML email body using placeholders like `{{Name}}`
5. Preview row-one personalization
6. Send a test email to yourself
7. Send the full batch once the preview looks right

## Sample Data

A starter CSV is included at `public/sample-contacts.csv`.

## Scripts

- `npm run dev` starts the dev server
- `npm run build` creates a production build
- `npm run start` runs the production server
- `npm run setup:local` creates `.env.local` for a fresh clone

## Notes

- Gmail limits and anti-abuse systems still apply, so the app sends sequentially with a delay.
- This project is designed for local use with each user bringing their own Google OAuth credentials.
- Do not commit `.env.local` or any real client secrets.
