"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useScanner } from '@/hooks/useScanner';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { calculateTax } from '@/utils/calculateTax';
import { formatCurrency } from '@/utils/formatCurrency';
import { orderService } from '@/services/orderService';
import { toast } from 'react-hot-toast';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface BarcodeScannerProps {
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onClose }) => {
  const router = useRouter();
  const { scannedItems, isProcessing, error, handleScan, resetScanner } = useScanner();
  const [testCode, setTestCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStartingRef = useRef(false);

  useEffect(() => {
    // Initialize Scanner when there is no scanned item
    if (!scannedItems) {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("reader");
      }
      
      const startScanner = async () => {
        if (isStartingRef.current || scannerRef.current?.isScanning) return;
        isStartingRef.current = true;
        try {
          await scannerRef.current?.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
              // Pause scanner after successful scan
              if (scannerRef.current?.isScanning) {
                scannerRef.current?.stop().catch(console.error);
              }
              handleScan(decodedText);
            },
            (errorMessage) => {
              // Ignore typical parse errors
            }
          );
        } catch (err: any) {
          console.error("Failed to start scanner", err);
          if (!err?.message?.includes("is already in execution") && !err?.message?.includes("already running")) {
            toast.error("Gagal mengakses kamera");
          }
        } finally {
          isStartingRef.current = false;
        }
      };
      
      startScanner();
    }

    return () => {
      // Cleanup
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [scannedItems, handleScan]);

  const handleTestScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (testCode.trim()) {
      if (scannerRef.current?.isScanning) {
        scannerRef.current?.stop().catch(console.error);
      }
      handleScan(testCode);
    }
  };

  const handleCreateOrder = async () => {
    if (!scannedItems || scannedItems.length === 0) return;
    
    try {
      setIsSubmitting(true);
      
      await orderService.create({
        status: "confirmed",
        payment_status: "paid",
        items: scannedItems.map(item => ({
          menu_code: item.menu.code,
          quantity: item.quantity,
        }))
      });
      
      toast.success("Pesanan berhasil dibuat & dibayar!");
      onClose(); // Close scanner
      router.push('/');
    } catch (error) {
      toast.error("Gagal membuat pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = scannedItems ? scannedItems.reduce((acc, current) => acc + (current.menu.price * current.quantity), 0) : 0;
  const taxDetails = calculateTax(totalPrice, 1);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="p-4 flex justify-between items-center bg-black/50 text-white absolute top-0 w-full z-10">
        <h2 className="font-semibold flex items-center gap-2"><FaCamera /> Scan Kode Menu</h2>
        <button onClick={onClose} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
          <FaTimes />
        </button>
      </div>

      {!scannedItems ? (
        <div className="flex-1 flex flex-col justify-center items-center h-full relative relative">
          <div id="reader" className="w-full max-w-md bg-black"></div>
          
          <div className="absolute bottom-8 left-0 right-0 p-4 w-full max-w-md mx-auto">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <p className="text-sm text-gray-500 mb-3 text-center">Atau masukkan kode secara manual:</p>
              <form onSubmit={handleTestScan} className="flex gap-2">
                <Input 
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  placeholder="Contoh: S1(2) atau S1"
                  className="flex-1"
                />
                <Button type="submit" disabled={isProcessing}>Scan</Button>
              </form>
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-gray-50 p-4 flex flex-col items-center justify-center overflow-y-auto pt-20">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
            <div className="text-center border-b pb-4 mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Detail Pesanan</h3>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {scannedItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary bg-primary/10 w-8 h-8 flex items-center justify-center rounded-full text-sm">
                      {item.quantity}x
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{item.menu.name}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(item.menu.price)}</p>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-800">
                    {formatCurrency(item.menu.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
              <h4 className="font-bold border-b pb-2 mb-2">Rincian Pembayaran</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Harga</span>
                  <span>{formatCurrency(taxDetails.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PB1 (10%)</span>
                  <span>{formatCurrency(taxDetails.tax)}</span>
                </div>
                <div className="flex justify-between text-gray-500 line-through">
                  <span>Before rounding</span>
                  <span>{formatCurrency(taxDetails.beforeRounding)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rounding</span>
                  <span>{formatCurrency(taxDetails.rounding)}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3 text-primary">
                <span>Total Bayar</span>
                <span>{formatCurrency(taxDetails.total)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                fullWidth 
                onClick={resetScanner}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button 
                fullWidth 
                onClick={handleCreateOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Konfirmasi Pembayaran'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};