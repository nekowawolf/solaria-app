"use client";
import { FaUtensils, FaShoppingCart, FaPlus, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/services/api';
import toast from 'react-hot-toast';

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Analytics', path: '/analytics', icon: <FaChartBar /> },
    { name: 'Pesanan', path: '/', icon: <FaShoppingCart /> },
    { name: 'Menu', path: '/menu', icon: <FaUtensils /> },
    { name: 'Tambah Menu', path: '/add-menu', icon: <FaPlus /> },
  ];

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      toast.success("Berhasil keluar dari sesi");
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    } catch (error) {
      toast.error("Gagal logout!");
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100 h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center overflow-hidden shadow-lg shadow-primary/20">
          <img
            src="/img/solaria.png"
            alt="Solaria Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          Solaria <span className="text-primary">Admin</span>
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-md shadow-primary/25 translate-x-1' 
                  : 'text-gray-500 hover:bg-primary/5 hover:text-primary hover:translate-x-1'
              }`}
            >
              <div className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100/80">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 px-4 py-3 text-red-500 bg-red-50 hover:bg-red-100 hover:shadow-sm hover:-translate-y-0.5 rounded-2xl transition-all duration-300 font-bold text-sm"
        >
          <FaSignOutAlt />
          Keluar Sesi
        </button>
        <div className="mt-4 text-xs text-center text-gray-400 font-medium">
          &copy; {new Date().getFullYear()} Solaria System
        </div>
      </div>
    </aside>
  );
};