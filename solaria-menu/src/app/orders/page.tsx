"use client";

import { useCart } from '../../hooks/useCart';
import EmptyState from '../../components/EmptyState';
import Link from 'next/link';

export default function OrdersPage() {
  const { cartItems, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

  return (
    <div className="flex flex-col min-h-screen bg-app-bg">
      <div className="px-6 py-4 text-center">
        <h1 className="font-extrabold text-2xl text-gray-800 tracking-tight">Pesanan Anda</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex-1 bg-transparent">
          <EmptyState
            title="Belum ada pesanan"
            message="Anda belum menambahkan pesanan apa pun ke keranjang."
            actionText="Lihat Menu"
            actionHref="/"
          />
        </div>
      ) : (
        <div className="flex-1 pb-44">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-xl font-bold text-gray-800">Daftar Menu</h2>
            <p className="text-sm text-gray-500 mt-1">Berikut adalah daftar hidangan yang Anda pesan.</p>
          </div>

          <div className="px-6 mt-4 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">Jumlah: {item.quantity}</p>
                </div>
                <div className="font-bold text-[#B21B7A]">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 mt-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-500">Total Sementara</span>
                <span className="font-bold text-xl text-gray-900">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <Link href="/cart" className="mt-4 flex items-center justify-center w-full bg-[#B21B7A] text-white text-center py-4 rounded-2xl font-bold shadow-md hover:bg-[#911563] transition-colors">
                Lanjut ke Keranjang
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}