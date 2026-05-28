import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Apple Nukus | Premium Store",
  description: "Apple Nukus do'konining rasmiy sayti",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#0f0f11] text-gray-200`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
