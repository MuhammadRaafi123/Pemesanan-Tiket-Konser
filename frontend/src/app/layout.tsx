import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, Sora } from "next/font/google";

import Providers from "./providers";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tixora",
    template: "%s · Tixora",
  },
  description:
    "Temukan konser, pesan tiket resmi terverifikasi, dan simpan momen live-mu bersama Tixora.",
  applicationName: "Tixora",
  icons: {
    icon: "/logo.ico",
  },
  openGraph: {
    title: "Tixora",
    description:
      "Kurasi konser musik lokal dan internasional dengan tiket resmi terverifikasi.",
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fffdf2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${fraunces.variable} ${sora.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
