# Initial Project Structure

```text
mail-merger/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── mail/send/route.ts
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/google-sign-in-button.tsx
│   ├── composer/email-editor.tsx
│   ├── composer/placeholder-panel.tsx
│   ├── uploads/file-uploader.tsx
│   └── uploads/data-preview-table.tsx
├── lib/
│   ├── auth.ts
│   ├── gmail.ts
│   ├── parse-csv.ts
│   ├── parse-xlsx.ts
│   └── templates.ts
├── types/
│   └── next-auth.d.ts
├── .env.example
├── package.json
└── tsconfig.json
```

## Recommended dependencies

```bash
npm install next react react-dom next-auth googleapis papaparse xlsx @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder zod tailwindcss
npm install -D typescript @types/node @types/react @types/react-dom @types/papaparse postcss autoprefixer eslint eslint-config-next
```
