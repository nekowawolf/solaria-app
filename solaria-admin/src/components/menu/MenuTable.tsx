"use client";
import React, { useState } from 'react';
import { Menu } from '@/types/menu';
import { Table } from '@/components/common/Table';
import { formatCurrency } from '@/utils/formatCurrency';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagination from '@/components/common/Pagination';

interface MenuTableProps {
  menus: Menu[];
  isLoading: boolean;
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
}

export const MenuTable: React.FC<MenuTableProps> = ({ menus, isLoading, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Memuat menu...</div>;
  }
  const safeMenus = Array.isArray(menus) ? menus : [];
  const currentItems = safeMenus.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns = [
    { 
      header: 'Gambar', 
      accessor: (row: Menu) => (
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden shadow-sm">
          <img 
            src={row.image_url || "/img/solaria.png"} 
            alt={row.name} 
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/img/solaria.png'; }}
          />
        </div>
      )
    },
    { header: 'Kode', accessor: (row: Menu) => <span className="font-bold bg-primary/10 text-primary px-3 py-1 rounded-full text-xs shadow-sm">{row.code}</span> },
    { header: 'Nama Menu', accessor: (row: Menu) => <span className="font-semibold text-gray-800">{row.name}</span> },
    { header: 'Kategori', accessor: (row: Menu) => (
      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium shadow-sm">{row.category}</span>
    )},
    { header: 'Harga', accessor: (row: Menu) => <span className="text-primary font-bold text-sm">{formatCurrency(row.price)}</span> },
    { 
      header: 'Aksi', 
      accessor: (row: Menu) => (
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(row)}
            className="p-2 text-blue-500 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button 
            onClick={() => onDelete(row)}
            className="p-2 text-red-500 hover:bg-red-50 hover:shadow-md rounded-xl transition-all"
            title="Hapus"
          >
            <FaTrash />
          </button>
        </div>
      ) 
    }
  ];

  return (
    <>
      <div className="hidden md:block shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <Table 
          data={currentItems} 
          columns={columns} 
          keyExtractor={(row) => row.id} 
          emptyMessage="Belum ada menu yang ditambahkan" 
        />
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {currentItems.length === 0 ? (
           <div className="p-10 text-center bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500">
             Belum ada data menu
           </div>
        ) : (
          currentItems.map((menu) => (
            <div key={menu.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
               <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary/20 overflow-hidden shadow-inner">
                  <img src={menu.image_url || "/img/solaria.png"} alt={menu.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/img/solaria.png'; }} />
               </div>
               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-primary/10 px-1.5 py-0.5 rounded text-primary">{menu.code}</span>
                    <span className="text-[9px] font-medium bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-500 uppercase">{menu.category}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm leading-tight">{menu.name}</h4>
                  <div className="text-primary font-bold text-sm mt-1">{formatCurrency(menu.price)}</div>
               </div>
               <div className="flex flex-col gap-2">
                  <button onClick={() => onEdit(menu)} className="p-2 text-blue-500 hover:bg-blue-100 bg-blue-50 rounded-lg transition-colors"><FaEdit className="w-3 h-3" /></button>
                  <button onClick={() => onDelete(menu)} className="p-2 text-red-500 hover:bg-red-100 bg-red-50 rounded-lg transition-colors"><FaTrash className="w-3 h-3" /></button>
               </div>
            </div>
          ))
        )}
      </div>

      <Pagination 
         currentPage={currentPage}
         totalItems={safeMenus.length}
         itemsPerPage={itemsPerPage}
         onPageChange={setCurrentPage}
      />
    </>
  );
};