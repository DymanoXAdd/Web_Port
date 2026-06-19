/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        // Prevent MIME-type sniffing
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        // Prevent clickjacking — only same origin can frame us
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
        // Legacy XSS filter (belt-and-suspenders alongside CSP)
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        // Don't leak full URL in Referer header to third parties
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        // Lock down hardware access
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        // HSTS — force HTTPS for 1 year, include subdomains
        // NOTE: only activates when site is served over HTTPS (Vercel prod)
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
        // Content Security Policy
        // - default-src 'self': only load resources from our own origin
        // - script-src: Next.js needs 'unsafe-eval' in dev; tighten in prod
        // - style-src: Tailwind generates inline styles so 'unsafe-inline' required
        // - img-src: self + Sanity CDN + data URIs (base64 images)
        // - connect-src: Sanity API + Vercel Analytics
        // - frame-ancestors: nobody may embed us (stricter than X-Frame-Options)
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' https://cdn.sanity.io data: blob:",
            "font-src 'self' data:",
            "connect-src 'self' https://cdn.sanity.io https://api.sanity.io https://vitals.vercel-insights.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
        // Prevent browsers from DNS-prefetching (minor privacy gain)
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
      ],
    },
  ],
};

module.exports = nextConfig;
