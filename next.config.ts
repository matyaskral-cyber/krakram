import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
    ].join("; "),
  },
];

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Fotky produktů z PML (veřejný sklad). Přes optimalizaci Vercelu, takže
  // PML vidí jen pár dotazů a ne každého návštěvníka.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pml-system.cz", pathname: "/verejne/v1/obrazek/**" },
      // lokální PML při vývoji
      ...(isDev
        ? [{ protocol: "http" as const, hostname: "127.0.0.1", pathname: "/verejne/v1/obrazek/**" }]
        : []),
    ],
    dangerouslyAllowLocalIP: isDev,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
