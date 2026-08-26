import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LabhSetu",
  description: "AI-powered Indian government scheme eligibility finder."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
