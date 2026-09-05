import type {
  Metadata,
} from "next";

import Providers from "./providers";

import "./globals.css";


export const metadata:
  Metadata = {
    title:
      "Ticketing Platform",
    description:
      "Platform pemesanan tiket konser",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="id"
    >
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}