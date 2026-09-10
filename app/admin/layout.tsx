import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Kabero — Admin",
};

// A root layout of its own (per Next.js's "multiple root layouts" pattern —
// any layout with no layout.tsx above it is a root layout): the admin never
// shares a locale with the public site, so it gets a fixed `lang="es"` and
// stays completely outside the `app/[locale]/` tree used by the public pages.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
