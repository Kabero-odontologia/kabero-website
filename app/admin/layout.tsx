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
      {/* Inline style (not a Tailwind class) so this actually overrides the
          shared globals.css `body { background }` rule — that rule is plain
          unlayered CSS, which beats a Tailwind utility class regardless of
          specificity under Tailwind v4's cascade layers. Needed so trackpad
          rubber-band overscroll past the bottom of the page shows dark, not
          the public site's light body background. */}
      <body
        className="min-h-full flex flex-col font-sans"
        style={{ backgroundColor: "#0A0A0B", overscrollBehaviorY: "none" }}
      >
        {children}
      </body>
    </html>
  );
}
