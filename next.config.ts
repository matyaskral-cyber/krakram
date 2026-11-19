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
      // Pokladna e-shopu smí načíst widget ověření věku (Ověř18), ale jen
      // když je služba zapnutá klíčem. Zbytek webu zůstává zavřený.
      ...(process.env.OVER18_KLIC
        ? [
            {
              source: "/obchod/pokladna",
              headers: [
                {
                  key: "Content-Security-Policy",
                  value: [
                    "default-src 'self'",
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.over18.cz",
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.over18.cz",
                    "font-src 'self' https://fonts.gstatic.com",
                    "img-src 'self' data: blob: https://api.over18.cz",
                    "connect-src 'self' https://api.over18.cz",
                    "frame-src https://api.over18.cz https://www.over18.cz",
                  ].join("; "),
                },
              ],
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
