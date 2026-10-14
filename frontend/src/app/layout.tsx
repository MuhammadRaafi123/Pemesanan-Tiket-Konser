import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

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

export const metadata: Metadata = {
  title: {
    default: "Concertix — Tiket konser resmi pilihan",
    template: "%s · Concertix",
  },
  description:
    "Temukan konser, pesan tiket resmi terverifikasi, dan simpan momen live-mu bersama Concertix.",
  applicationName: "Concertix",
  openGraph: {
    title: "Concertix — Tiket konser resmi pilihan",
    description:
      "Kurasi konser musik lokal dan internasional dengan tiket resmi terverifikasi.",
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f7fd",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
