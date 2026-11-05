import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS2 Booster — Verified FPS Performance for Counter-Strike 2",
  description:
    "Software executável nativo Win32/C# .NET 8 AOT para Counter-Strike 2: timer 0.500ms, bypass TCP sub-tick, isolamento P-Core e 100% VAC Safe.",
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
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="app min-h-screen bg-[#080808] text-white selection:bg-white selection:text-black overflow-x-hidden w-full">
        <div className="tidal-grid w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
