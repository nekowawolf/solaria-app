import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { CartProvider } from '../hooks/useCart';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Solaria Menu',
  description: 'Digital Restaurant Menu System for fast and frictionless ordering.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 min-h-screen text-gray-900 antialiased`}>
        <CartProvider>
          <div className="max-w-md mx-auto bg-app-bg min-h-screen shadow-2xl relative overflow-x-hidden flex flex-col">
            <Header />
            {children}
            <BottomNav />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}