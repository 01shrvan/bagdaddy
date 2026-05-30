import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "https://bagdaddy.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/i/"],
        disallow: ["/dashboard", "/clients", "/projects", "/time", "/invoices", "/settings", "/api/"],
      },
    ],
    sitemap: `${url}/sitemap.xml`,
  };
}
