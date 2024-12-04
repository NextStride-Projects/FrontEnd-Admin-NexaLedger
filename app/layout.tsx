import type { Metadata } from "next";
import localFont from "next/font/local";
import AppBar from "@/app/components/AppBar"; // Import the AppBar
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NexaLedger Admin Board",
  description: "Admin panel for NexaLedger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-200 antialiased`}
      >
        {/* Add AppBar */}
        <AppBar />
        <main className="m-8 bg-white rounded">{children}</main>
      </body>
    </html>
  );
}
