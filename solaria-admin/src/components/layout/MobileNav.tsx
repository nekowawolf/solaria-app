"use client";
import { FaUtensils, FaShoppingCart, FaPlus, FaChartBar } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileNav = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Analytics', path: '/analytics', icon: <FaChartBar /> },
    { name: 'Pesanan', path: '/', icon: <FaShoppingCart /> },
    { name: 'Menu', path: '/menu', icon: <FaUtensils /> },
    { name: 'Add', path: '/add-menu', icon: <FaPlus /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 pb-safe">
      <div className="flex justify-around items-center p-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex flex-col items-center p-2 min-w-[64px] rounded-lg transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="text-xl mb-1">
                {item.icon}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};