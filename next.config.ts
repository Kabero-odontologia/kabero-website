import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  // Lets phones/tablets on the same WiFi load the dev server via LAN IP —
  // without this, Next.js blocks cross-origin dev asset requests, so the page's
  // HTML renders but its JS bundle silently fails to load (no hydration at all).
  allowedDevOrigins: ["192.168.1.6"],
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
