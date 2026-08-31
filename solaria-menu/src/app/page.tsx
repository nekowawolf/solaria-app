"use client";

import { useState, useEffect } from 'react';
import MenuCard from '../components/MenuCard';
import CategoryTabs from '../components/CategoryTabs';
import { useCart } from '../hooks/useCart';
import { IoSearchOutline } from 'react-icons/io5';
import { menuService } from '../services/menuService';
import { MenuItem } from '../types/menu';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<string[]>(["Semua"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await menuService.getAll();
        setMenuItems(data);
        const categories = Array.from(new Set(data.map(item => item.category).filter(Boolean)));
        setMenuCategories(["Semua", ...categories]);
      } catch (error) {
        console.error("Failed to load menus");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-transparent relative pb-28 min-h-screen">

      {/* Hero / Title */}
      <div className="px-6 py-8">
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
          Selamat Datang di <span className="text-[#B21B7A]">Solaria</span>
        </h2>
        <p className="text-gray-500 text-sm">Temukan hidangan favoritmu dengan mudah dan cepat</p>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="bg-gray-50 rounded-full flex items-center px-5 py-3.5 border border-gray-100 shadow-inner">
          <IoSearchOutline className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Mau makan apa hari ini?" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none ml-3 w-full text-sm font-medium text-gray-700 placeholder-gray-400" 
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mb-6 overflow-hidden">
        <CategoryTabs categories={menuCategories} selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {/* Menu List */}
      <div className="px-6 pb-6 mt-2">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B21B7A]"></div>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <MenuCard key={item.id} item={item} onAdd={addItem} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[#B21B7A] text-sm font-medium">
              Menu yang kamu cari tidak tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}