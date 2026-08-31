"use client";
import React, { useState } from 'react';
import { Order } from '@/types/order';
import { Table } from '@/components/common/Table';
import { formatCurrency } from '@/utils/formatCurrency';
import Pagination from '@/components/common/Pagination';
import { FaTrash } from 'react-icons/fa';
import { orderService } from '@/services/orderService';
import toast from 'react-hot-toast';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onDeleteSuccess?: () => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, isLoading, onDeleteSuccess }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrderCode, setSelectedOrderCode] = useState<string | null>(null);
  const itemsPerPage = 6;

  const handleDeleteClick = (orderCode: string) => {
    setSelectedOrderCode(orderCode);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrderCode) return;

    try {
      setIsDeleting(selectedOrderCode);
      await orderService.delete(selectedOrderCode);
      toast.success('Pesanan berhasil dihapus');
      setIsDeleteModalOpen(false);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      toast.error('Gagal menghapus pesanan');
    } finally {
      setIsDeleting(null);
      setSelectedOrderCode(null);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Memuat pesanan...</div>;
  }

  const safeOrders = Array.isArray(orders) ? orders : [];
  const currentItems = safeOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch(e) {
      return dateStr;
    }
  };

  const columns = [
    { header: 'ID Pesanan', accessor: (row: Order) => <span className="font-mono font-bold bg-primary/5 text-primary px-3 py-1 rounded-full text-xs shadow-sm">{row.order_code || `ORD-${row.id}`}</span> },
    { header: 'Status Pembayaran', accessor: (row: Order) => (
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
        {row.payment_status}
      </span>
    ) },
    { header: 'Total Bayar', accessor: (row: Order) => <span className="font-bold text-gray-800">{formatCurrency(row.total_amount)}</span> },
    { header: 'Waktu', accessor: (row: Order) => <span>{formatDateTime(row.created_at)}</span> },
    { 
      header: 'Aksi', 
      accessor: (row: Order) => (
        <button
          onClick={() => handleDeleteClick(row.order_code)}
          disabled={isDeleting === row.order_code}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
          title="Hapus Pesanan"
        >
          {isDeleting === row.order_code ? (
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FaTrash size={18} />
          )}
        </button>
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
          emptyMessage="Tidak ada pesanan aktif saat ini" 
        />
      </div>
      
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {currentItems.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500">
            Tidak ada pesanan aktif
          </div>
        ) : (
          currentItems.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-mono font-bold text-sm bg-primary/10 text-primary px-2 py-1 rounded inline-block mb-1">{order.order_code || `ORD-${order.id}`}</div>
                  <div className="text-xs text-gray-500 font-medium">
                    {formatDateTime(order.created_at)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {order.payment_status}
                  </span>
                  <button
                    onClick={() => handleDeleteClick(order.order_code)}
                    disabled={isDeleting === order.order_code}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isDeleting === order.order_code ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaTrash size={16} />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100/80">
                <span className="text-sm font-medium text-gray-500">Total</span>
                <span className="font-bold text-primary text-lg">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination 
         currentPage={currentPage}
         totalItems={safeOrders.length}
         itemsPerPage={itemsPerPage}
         onPageChange={setCurrentPage}
      />

      {/* Delete Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
            !
          </div>
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus pesanan <strong>{selectedOrderCode}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="pt-2 flex gap-3">
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={!!isDeleting}
            >
              Batal
            </Button>
            <Button 
              variant="danger" 
              fullWidth 
              onClick={handleDeleteConfirm}
              disabled={!!isDeleting}
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};