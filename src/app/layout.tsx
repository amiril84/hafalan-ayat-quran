import type { Metadata } from "next";
import { getPublicAppName } from "@/lib/env";
import { Providers } from "./providers";
import "./globals.css";

const appName = getPublicAppName();

export const metadata: Metadata = {
  metadataBase: new URL("https://tahfidzh-mj.vercel.app"),
  applicationName: appName,
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description:
    "Aplikasi hafalan ayat tematik Al Quran dengan teks Arab, terjemahan Indonesia, tafsir publik, dan audio Sudais.",
  openGraph: {
    title: appName,
    description:
      "Latihan hafalan ayat tematik Al Quran dengan detail ayat, tafsir, dan audio.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
