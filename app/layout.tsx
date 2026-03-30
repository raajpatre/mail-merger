import type { Metadata } from "next";

import "./globals.css";

import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  title: "MailMerger",
  description: "Send personalized Gmail campaigns from CSV or Excel data."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
