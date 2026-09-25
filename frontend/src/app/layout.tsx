import type {
  Metadata,
} from "next";

import Providers from "./providers";

import "./globals.css";


export const metadata:
  Metadata = {
    title:
      "Concertix — Curated live experiences",
    description:
      "Temukan konser, pesan tiket resmi, dan simpan momen live-mu bersama Concertix.",
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
    >
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}