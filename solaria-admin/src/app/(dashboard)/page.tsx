"use client";
import { useOrders } from '@/hooks/useOrders';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { Header } from '@/components/layout/Header';

export default function OrdersPage() {
  const { orders, isLoading, error, refetch } = useOrders();

  return (
    <>
      <Header />
      <main className="p-4 md:p-6 container mx-auto">
        <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Daftar Pesanan Aktif</h3>
            <p className="text-gray-500 text-sm mt-1">Real-time update pesanan yang sudah dibayar</p>
          </div>
          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-100 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-green-600 hidden md:block uppercase tracking-wider">Real Time</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-4 border border-red-100">
            {error}
          </div>
        )}

        <OrdersTable 
          orders={orders} 
          isLoading={isLoading} 
          onDeleteSuccess={refetch}
        />
      </main>
    </>
  );
}