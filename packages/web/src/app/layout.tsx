import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS2 BOOSTER // Noir Pro Arena — Elo Boost & Hardware Optimization",
  description:
    "Plataforma definitiva para CS2: boosting rankeado, coaching profissional e otimização de FPS com tweaks do sistema Windows.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-theme="dark" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="app min-h-screen bg-[#080808] text-white selection:bg-white selection:text-black">
        <div className="tidal-grid">
          {children}
        </div>
      </body>
    </html>
  );
}
