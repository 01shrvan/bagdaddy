import type { Metadata, Viewport } from "next";
import { Syne, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const syne = Syne({ subsets: ["latin"], variable: "--font-heading", weight: ["400", "500", "600", "700", "800"] });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600", "700"] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://bagdaddy.vercel.app";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "bagdaddy — freelance finance, simplified",
    template: "%s · bagdaddy",
  },
  description:
    "Track clients, log hours, and send invoices. The no-nonsense freelance tool for people who'd rather be working than doing admin.",
  keywords: [
    "freelance invoice",
    "invoice generator",
    "project tracker",
    "time tracking",
    "freelancer tools",
    "hourly billing",
    "client management",
    "freelance finance",
  ],
  authors: [{ name: "bagdaddy" }],
  creator: "bagdaddy",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "bagdaddy",
    title: "bagdaddy — freelance finance, simplified",
    description:
      "Track clients, log hours, and send invoices. The no-nonsense freelance tool for people who'd rather be working than doing admin.",
    images: [
      {
        url: `${APP_URL}/opengraph-image`,
        secureUrl: `${APP_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "bagdaddy — freelance finance, simplified",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "bagdaddy — freelance finance, simplified",
    description:
      "Track clients, log hours, and send invoices. The no-nonsense freelance tool for people who'd rather be working.",
    images: [`${APP_URL}/opengraph-image`],
    creator: "@bagdaddy",
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("dark h-full antialiased", "font-sans", instrumentSans.variable, syne.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
