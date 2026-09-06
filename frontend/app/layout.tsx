import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🔥 IGNIS — Intelligent Geospatial Fire Surveillance",
  description: "AI-powered fire classification using NASA FIRMS satellite data and OpenStreetMap industrial mapping for NTRO (SIH26162)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#020617] text-[#f8fafc] antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
