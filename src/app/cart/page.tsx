"use client";

import { useCart } from '../../hooks/useCart';
import CartItem from '../../components/CartItem';
import EmptyState from '../../components/EmptyState';
import { IoReceiptOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, increaseQty, decreaseQty, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();
  const pb1 = totalPrice * 0.1;
  const beforeRounding = totalPrice + pb1;
  const roundedTotal = Math.round(beforeRounding / 100) * 100;
  const rounding = roundedTotal - beforeRounding;
  const router = useRouter();

  const handleGenerateCode = () => {
    const code = cartItems.map(item => `${item.code}(${item.quantity})`).join(', ');
    router.push(`/summary?code=${encodeURIComponent(code)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-app-bg">
      <div className="px-6 py-4 text-center">
        <h1 className="font-extrabold text-2xl text-gray-800 tracking-tight">Keranjang Anda</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex-1 bg-transparent">
          <EmptyState
            title="Keranjang masih kosong"
            message="Sepertinya Anda belum memesan hidangan yang lezat."
            actionText="Jelajahi Menu"
            actionHref="/"
          />
        </div>
      ) : (
        <div className="flex-1 pb-96">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-xl font-bold text-gray-800">Tinjau Pesanan</h2>
            <p className="text-sm text-gray-500 mt-1">Periksa kembali pilihan hidangan Anda sebelum melanjutkan.</p>
          </div>

          <div className="px-6 mt-4">
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={increaseQty}
                onDecrease={decreaseQty}
              />
            ))}
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="fixed bottom-[66px] left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.06)] px-8 py-6 border-t border-gray-50 z-10">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold text-gray-800">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span className="font-medium">PB1 10%</span>
              <span className="font-bold text-gray-800">Rp {pb1.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span className="font-medium">Before rounding</span>
              <span className="font-bold text-gray-800">Rp {beforeRounding.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span className="font-medium">Rounding</span>
              <span className="font-bold text-gray-800">Rp {rounding.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <div className="flex justify-between font-black text-2xl text-gray-900 mb-5 pt-4 border-t border-gray-100">
            <span>Total</span>
            <span className="text-primary">Rp {roundedTotal.toLocaleString('id-ID')}</span>
          </div>

          <button
            onClick={handleGenerateCode}
            className="w-full bg-primary text-white text-center rounded-2xl py-4 font-bold shadow-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
          >
            <IoReceiptOutline className="w-5 h-5" />
            <span>Buat Kode Pesanan</span>
          </button>
        </div>
      )}
    </div>
  );
}