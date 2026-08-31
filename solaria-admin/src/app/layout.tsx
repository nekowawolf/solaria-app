import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solaria Admin Dashboard",
  description: "Admin dashboard for managing orders and menus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen pb-16 md:pb-0`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}