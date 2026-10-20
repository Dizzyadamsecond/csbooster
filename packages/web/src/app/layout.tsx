import "./globals.css";
import { ThemeToggle } from "@/components/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS2 BOOTS // E-Sports Elo Boost & FPS Optimization",
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,600;0,700;1,700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="app min-h-screen">
        <div className="tidal-grid">
          <ThemeToggle />
          {children}
        </div>
      </body>
    </html>
  );
}
