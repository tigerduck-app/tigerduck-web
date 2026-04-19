import type { Metadata } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-noto-tc",
  display: "swap",
  weight: ["400", "500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tigerduck.app"),
  title: {
    default: "TigerDuck — 臺科大校園助手",
    template: "%s | TigerDuck",
  },
  description: "由臺科大學生建造的校園助手 App，整合作業、課表、圖書館、行事曆",
  openGraph: {
    type: "website",
    siteName: "TigerDuck",
    images: [{ url: "https://tigerduck.app/og-image.png", width: 1200, height: 630, alt: "TigerDuck" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://tigerduck.app/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${notoSansTC.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta property="og:image" content="https://tigerduck.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              if (theme === 'dark' || theme === 'light') {
                document.documentElement.setAttribute('data-theme', theme);
              }
            } catch(e) {}
          })();
        ` }} />
        {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
