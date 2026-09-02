import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Lets phones/tablets on the same WiFi load the dev server via LAN IP —
  // without this, Next.js blocks cross-origin dev asset requests, so the page's
  // HTML renders but its JS bundle silently fails to load (no hydration at all).
  allowedDevOrigins: ["192.168.1.6"],
};

export default nextConfig;
