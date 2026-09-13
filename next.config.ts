import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  // Lets phones/tablets on the same WiFi load the dev server via LAN IP —
  // without this, Next.js blocks cross-origin dev asset requests, so the page's
  // HTML renders but its JS bundle silently fails to load (no hydration at all).
  allowedDevOrigins: ["192.168.1.6"],
  images: {
    // Next's default (when `images` isn't configured) rejects any local image
    // whose URL has a query string — but the crop/pan/zoom system encodes
    // framing as query params (?dx=&dy=&dz=...) directly on every photo's src,
    // so every cropped image would 400 through the optimizer without this.
    localPatterns: [{ pathname: "/**" }],
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
