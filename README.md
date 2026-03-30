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

Open `.env.local` in the project root and replace the placeholder values for:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Your file should look like this after editing:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generated-by-setup-script

GOOGLE_CLIENT_ID=your-client-id-from-google-cloud
GOOGLE_CLIENT_SECRET=your-client-secret-from-google-cloud
```

You can get these two values from a Google Cloud OAuth client JSON file. If you downloaded a file that looks like this:

```json
{
  "web": {
    "client_id": "...",
    "client_secret": "..."
  }
}
```

then:

- `client_id` goes into `GOOGLE_CLIENT_ID`
- `client_secret` goes into `GOOGLE_CLIENT_SECRET`

### 4. Configure Google Cloud

Follow these steps in [Google Cloud Console](https://console.cloud.google.com/):

#### A. Create or choose a project

1. Open the top project selector in Google Cloud Console.
2. Create a new project or choose an existing one.
3. Wait until that project is the active project.

#### B. Enable the Gmail API

1. In the left sidebar, go to `APIs & Services` -> `Library`.
2. Search for `Gmail API`.
3. Open `Gmail API`.
4. Click `Enable`.

#### C. Configure the OAuth consent screen

1. Go to `APIs & Services` -> `OAuth consent screen`.
2. Choose `External` unless this is only for a Google Workspace organization you control.
3. Click `Create`.
4. Fill in the required fields:
   - App name: for example `MailMerger`
   - User support email: your email
   - Developer contact email: your email
5. Save and continue.

#### D. Add the Gmail permission

1. In the consent screen flow, open the `Scopes` step.
2. Click `Add or Remove Scopes`.
3. Search for:
   `https://www.googleapis.com/auth/gmail.send`
4. Select it and save.

This app also uses basic Google sign-in info such as email and profile, which Google usually handles automatically during OAuth setup.

#### E. Add test users

If your app is still in testing mode:

1. In `OAuth consent screen`, open the `Test users` section.
2. Click `Add users`.
3. Add the Gmail address you will use to sign in locally.
4. Save.

If you skip this step while the app is in testing mode, Google sign-in will fail for accounts that are not listed.

#### F. Create OAuth credentials

1. Go to `APIs & Services` -> `Credentials`.
2. Click `Create Credentials`.
3. Choose `OAuth client ID`.
4. For application type, choose `Web application`.
5. Give it a name like `MailMerger Local`.

#### G. Add the correct redirect settings

Inside that OAuth client:

For `Authorized JavaScript origins`, add:

```text
http://localhost:3000
```

For `Authorized redirect URIs`, add:

```text
http://localhost:3000/api/auth/callback/google
```

Then click `Create`.

#### H. Copy the credentials into `.env.local`

After the OAuth client is created:

1. Copy the `Client ID`
2. Copy the `Client secret`
3. Paste them into `.env.local` as:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

#### I. Important local URL note

This README assumes you run the app locally at:

```text
http://localhost:3000
```

If you change the port, for example to `3001`, you must also update all of these:

- `NEXTAUTH_URL` in `.env.local`
- the OAuth client's `Authorized JavaScript origins`
- the OAuth client's `Authorized redirect URIs`

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
