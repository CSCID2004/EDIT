import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EDIT · CSCID Workspace",
  description: "Private website workspace for Coconut Shell Charcoal Indonesia.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
