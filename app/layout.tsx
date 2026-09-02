import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kabero — Odontología estética en Cochabamba",
  description: "Diagnóstico digital y planificación milimétrica, con un enfoque estético pensado para tu cara.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
