import type { Metadata } from "next";
import "./globals.css";
import { prisma } from "@/lib/db";

const FALLBACK_TITLE = "Kabero — Odontología estética en Cochabamba";
const FALLBACK_DESCRIPTION =
  "Diagnóstico digital y planificación milimétrica, con un enfoque estético pensado para tu cara.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return {
    title: settings?.seoTitle || FALLBACK_TITLE,
    description: settings?.seoDescription || FALLBACK_DESCRIPTION,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
