import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VanishHive",
  description: "Swarm away unwanted data and scams, vanishing threats through collective AI power.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>VanishHive</title>
        {/* <link rel="icon" href="https://hc-cdn.hel1.your-objectstorage.com/s/v3/c252531d54ac77f3a1cbbec472898065e5d7fdee_logo-removebg-preview.png"></link> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
