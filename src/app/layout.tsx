import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-headline",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FlowSync Treasury Ops 2.0 | Automated Cash Flow Dashboard",
  description: "Enterprise Automated Cash Flow Management & Treasury Operations Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${plusJakartaSans.variable} ${inter.variable} light`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans bg-[#f8faff] text-[#0f172a] antialiased selection:bg-pink-100 selection:text-pink-600">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
