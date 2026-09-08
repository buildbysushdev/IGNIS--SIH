import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/context/I18nContext";

export const viewport: Viewport = {
  themeColor: "#0a0e14",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "IGNIS-01 :: FIRE INTELLIGENCE GROUND STATION",
  description: "Mission Control Ground Station Terminal for Industrial Fire Classification (NTRO / SIH26162)",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IGNIS-01",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230a0e14'/><rect x='20' y='20' width='60' height='60' fill='none' stroke='%2300ff9c' stroke-width='8'/><rect x='42' y='42' width='16' height='16' fill='%2300d4ff'/></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0e14] text-[#d0d8e0] font-mono antialiased selection:bg-[#00d4ff] selection:text-[#0a0e14]">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}

