import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Cs2Booster - CS2 Performance Optimizer",
  description: "CS2 Performance Booster - Maximize your FPS with advanced Windows optimization",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}