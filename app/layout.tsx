import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Gistify",
  description: "Analyze documents with a multi-agent workflow",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
