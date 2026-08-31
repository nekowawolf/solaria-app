"use client";
import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { BarcodeScanner } from '@/components/scanner/BarcodeScanner';

interface HeaderProps {
  onOpenScanner?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenScanner }) => {
  const pathname = usePathname();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'Pesanan Aktif';
      case '/menu': return 'Daftar Menu';
      case '/add-menu': return 'Tambah Menu Baru';
      default: return 'Dashboard';
    }
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20 px-6 py-5 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{getPageTitle()}</h2>
          <p className="text-sm text-gray-500 hidden md:block">Kelola restoran Anda dengan efisien</p>
        </div>
        
        <button 
          onClick={() => setIsScannerOpen(true)}
          className="bg-primary/10 hover:bg-primary/20 text-primary p-3 rounded-full md:px-4 md:py-2 md:rounded-lg flex items-center gap-2 transition-colors"
          title="Buka Scanner"
        >
          <FaCamera className="text-xl md:text-base" />
          <span className="hidden md:inline font-medium">Scan Code</span>
        </button>
      </header>

      {isScannerOpen && (
        <BarcodeScanner onClose={() => setIsScannerOpen(false)} />
      )}
    </>
  );
};