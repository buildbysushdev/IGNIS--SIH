import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IGNIS — Fire Intelligence Command",
  description: "AI-powered real-time satellite fire surveillance and industrial anomaly classification for NTRO (SIH26162)",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-command-radial text-[#f8fafc] antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
