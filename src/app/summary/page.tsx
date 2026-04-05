"use client";

import { useEffect, useState, Suspense } from 'react';
import { useCart } from '../../hooks/useCart';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HiArrowLeft } from 'react-icons/hi';
import { FaCheck } from 'react-icons/fa';
import { MdAccessTime, MdRestaurantMenu } from 'react-icons/md';
import { RiInboxArchiveFill } from 'react-icons/ri';
import { menuItems } from '../../data/menu';

function SummaryContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [hasCleared, setHasCleared] = useState(false);

  useEffect(() => {
    if (!hasCleared) {
      clearCart();
      setHasCleared(true);
    }
  }, [clearCart, hasCleared]);

  if (!code) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-app-bg">
        <h3 className="text-xl font-bold mb-4">Tidak ada pesanan</h3>
        <Link href="/" className="text-primary font-bold">Kembali ke Menu</Link>
      </div>
    );
  }

  const orderItems = code.split(', ').map(str => {
    const match = str.match(/(.+)\((\d+)\)/);
    if (match) {
      const codeId = match[1];
      const qty = parseInt(match[2]);
      const menuItem = menuItems.find(m => m.code === codeId);
      return {
        code: codeId,
        name: menuItem?.name || 'Unknown Item',
        description: menuItem?.description || '',
        quantity: qty
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen bg-app-bg pb-32 overflow-x-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary-light to-transparent opacity-50 z-0"></div>

      <div className="flex-1 px-6 pb-12 pt-16 relative z-10 w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border-[6px] border-white ring-8 ring-primary/5">
            <div className="w-full h-full bg-[#B21B7A] rounded-full flex items-center justify-center">
              <FaCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-[11px] font-black tracking-[0.2em] text-[#B21B7A] uppercase mb-4">Kode Pesanan Anda</h2>
          
          <div className="bg-white py-8 px-6 rounded-[2rem] w-full text-center mb-6 relative overflow-hidden border border-[#FBCFE8]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-xl -ml-12 -mb-12"></div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-[#4A2B42] mb-3 relative z-10 tracking-tight break-words px-2">{code}</h1>
            <p className="text-sm text-gray-500 font-semibold flex items-center justify-center space-x-1.5 opacity-80 relative z-10 mt-3 mix-blend-multiply">
              <MdAccessTime className="w-4 h-4" />
              <span>Dipesan baru saja</span>
            </p>
          </div>
          
          <div className="w-full flex items-center justify-center space-x-2.5 bg-[#FDF2F8] text-[#B21B7A] px-5 py-3.5 rounded-full mb-8 font-bold text-sm shadow-sm transition-transform hover:scale-105">
            <RiInboxArchiveFill className="w-4 h-4" />
            <span>Silakan tunjukkan ke kasir</span>
          </div>

          <div className="w-full text-left mb-4 mt-2">
            <div className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center mb-4 mix-blend-multiply">
              <MdRestaurantMenu className="w-4 h-4 mr-2" />
              Pesanan Anda
            </div>
            
            <div className="space-y-3 w-full">
              {orderItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-[1.5rem] p-4 flex items-center shadow-sm w-full border border-gray-50">
                  <div className="w-12 h-12 rounded-full bg-[#FDF2F8] text-[#B21B7A] flex items-center justify-center font-black text-lg mr-4 flex-shrink-0">
                    {item?.code}
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-bold text-[#4A2B42] text-sm sm:text-base leading-tight truncate">{item?.name}</h3>
                    <p className="text-[11px] sm:text-xs text-gray-400 truncate mt-0.5">{item?.description}</p>
                  </div>
                  <div className="bg-[#FDF2F8] text-[#B21B7A] font-black px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap">
                    x {item?.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 relative">
          <Link href="/" className="w-full bg-[#FDF2F8] text-[#B21B7A] font-bold rounded-full py-4 transition-all hover:bg-primary/10 flex items-center justify-center space-x-2 shadow-sm relative z-10">
            <HiArrowLeft className="w-5 h-5" />
            <span>Kembali ke Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SummaryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-app-bg">Memuat...</div>}>
      <SummaryContent />
    </Suspense>
  );
}