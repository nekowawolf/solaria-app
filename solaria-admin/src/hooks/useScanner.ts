import { useState, useCallback } from 'react';
import { menuService } from '@/services/menuService';
import { Menu } from '@/types/menu';

export interface ScannedItem {
  menu: Menu;
  quantity: number;
}

export const useScanner = () => {
  const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScanning = () => {
    setIsScanning(true);
    setScannedItems(null);
    setError(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const handleScan = useCallback(async (code: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const allMenus = await menuService.getAll();
      const itemsToScan: { codeId: string, qty: number }[] = [];

      // Check if code contains comma and parentheses (Format: "S1(1), S2(2)")
      if (code.includes('(') && code.includes(')')) {
         const parts = code.split(', ');
         parts.forEach(part => {
           const match = part.match(/(.+)\((\d+)\)/);
           if (match) {
             itemsToScan.push({ codeId: match[1], qty: parseInt(match[2]) });
           }
         });
      } else {
         itemsToScan.push({ codeId: code.trim(), qty: 1 });
      }

      if (itemsToScan.length === 0) {
        setError(`Format kode tidak valid: ${code}`);
        setIsProcessing(false);
        return;
      }

      const scannedRes: ScannedItem[] = [];
      const notFound: string[] = [];

      itemsToScan.forEach(scanItem => {
        const found = allMenus.find(m => m.code === scanItem.codeId);
        if (found) {
          scannedRes.push({ menu: found, quantity: scanItem.qty });
        } else {
          notFound.push(scanItem.codeId);
        }
      });

      if (notFound.length > 0) {
        setError(`Menu dengan kode ${notFound.join(', ')} tidak ditemukan.`);
      } else if (scannedRes.length > 0) {
        setScannedItems(scannedRes);
        stopScanning(); 
      }
    } catch (err) {
      setError('Gagal memproses kode.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const resetScanner = () => {
    setScannedItems(null);
    setIsScanning(false);
    setError(null);
  };

  return {
    scannedItems,
    isScanning,
    isProcessing,
    error,
    startScanning,
    stopScanning,
    handleScan,
    resetScanner
  };
};