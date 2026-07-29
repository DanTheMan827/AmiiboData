import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amiibo Database",
  description: "Browse all amiibo figures, cards and yarn with game compatibility info.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
