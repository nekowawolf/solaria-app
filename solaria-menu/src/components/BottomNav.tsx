"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoRestaurantOutline, IoReceiptOutline, IoCartOutline } from 'react-icons/io5';
import { useCart } from '../hooks/useCart';

export default function BottomNav() {
  const pathname = usePathname();
  const { cartItems } = useCart();
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { name: 'Menu', href: '/', icon: IoRestaurantOutline },
    { name: 'Pesanan', href: '/orders', icon: IoReceiptOutline },
    { name: 'Keranjang', href: '/cart', icon: IoCartOutline, badge: cartItemsCount },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20 bg-white border-t border-gray-100 px-6 py-3 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.name === 'Pesanan' && pathname.includes('/orders'));
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[64px] transition-all duration-300 ${
                isActive ? 'bg-primary-light text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <item.icon className="w-6 h-6 mb-1" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}