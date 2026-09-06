import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IGNIS — Fire Intelligence Platform",
  description: "AI-powered fire classification using NASA FIRMS satellite data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0f172a] text-[#f8fafc] antialiased">
        {children}
      </body>
    </html>
  );
}
