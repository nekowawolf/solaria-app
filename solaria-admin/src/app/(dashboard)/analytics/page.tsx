"use client";

import React, { useState, useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Header } from '@/components/layout/Header';
import { formatCurrency } from '@/utils/formatCurrency';
import { FaDownload, FaChartLine, FaMoneyBillWave, FaShoppingCart, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function AnalyticsPage() {
  const { orders, isLoading } = useOrders();
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const safeOrders = Array.isArray(orders) ? orders : [];

  // Derived filter logic
  const filteredOrders = useMemo(() => {
    return safeOrders.filter(order => {
      const date = new Date(order.created_at);
      const yearMatch = selectedYear === 'all' || date.getFullYear().toString() === selectedYear;
      const monthMatch = selectedMonth === 'all' || (date.getMonth() + 1).toString() === selectedMonth;
      return yearMatch && monthMatch && order.payment_status === 'paid';
    });
  }, [safeOrders, selectedYear, selectedMonth]);

  // Aggregate metrics
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Chart data grouping by day or month
  const chartData = useMemo(() => {
    const map = new Map<string, number>();

    filteredOrders.forEach(order => {
      const date = new Date(order.created_at);
      let key = '';
      if (selectedMonth === 'all') {
        key = date.toLocaleString('id-ID', { month: 'short' });
      } else {
        key = date.getDate().toString();
      }
      map.set(key, (map.get(key) || 0) + order.total_amount);
    });

    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => {
        // simple sort
        if (selectedMonth === 'all') return 0;
        return parseInt(a.name) - parseInt(b.name);
      });
  }, [filteredOrders, selectedMonth]);

  // Export to CSV Function
  const exportToCSV = () => {
    const headers = ['Order ID', 'Waktu', 'Total Bayar', 'Status Pembayaran', 'Status Order'];
    const rows = filteredOrders.map(order => [
      order.order_code || `ORD-${order.id}`,
      new Date(order.created_at).toLocaleString('id-ID'),
      order.total_amount,
      order.payment_status,
      order.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `solaria_analytics_${selectedYear}_${selectedMonth}.csv`;
    link.click();
  };

  return (
    <>
      <Header />
      <main className="p-4 md:p-6 container mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-50 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Analytics Dashboard</h3>
            <p className="text-gray-500 text-sm mt-1">Pantau performa penjualan dan pendapatan Solaria</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Custom Year Dropdown */}
            <div className="relative min-w-[140px]">
              <div 
                onClick={() => {
                  setIsYearOpen(!isYearOpen);
                  setIsMonthOpen(false);
                }}
                className="flex items-center justify-between gap-2 bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:border-primary transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary text-xs" />
                  <span>{selectedYear === 'all' ? 'Semua Tahun' : selectedYear}</span>
                </div>
                <FaChevronDown className={`text-[10px] transition-transform duration-300 ${isYearOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isYearOpen && (
                <div className="absolute z-20 top-full mt-2 left-0 bg-white border border-gray-100 rounded-xl shadow-xl w-full py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {['all', '2026', '2025', '2024'].map((year) => (
                    <div 
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsYearOpen(false);
                      }}
                      className={`px-4 py-2 hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors text-sm font-medium ${selectedYear === year ? 'bg-primary/5 text-primary' : 'text-gray-600'}`}
                    >
                      {year === 'all' ? 'Semua Tahun' : year}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Month Dropdown */}
            <div className="relative min-w-[160px]">
              <div 
                onClick={() => {
                  setIsMonthOpen(!isMonthOpen);
                  setIsYearOpen(false);
                }}
                className="flex items-center justify-between gap-2 bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:border-primary transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary text-xs" />
                  <span>
                    {selectedMonth === 'all' ? 'Semua Bulan' : 
                      new Date(2024, parseInt(selectedMonth) - 1).toLocaleString('id-ID', { month: 'long' })}
                  </span>
                </div>
                <FaChevronDown className={`text-[10px] transition-transform duration-300 ${isMonthOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isMonthOpen && (
                <div className="absolute z-20 top-full mt-2 left-0 bg-white border border-gray-100 rounded-xl shadow-xl w-full py-2 overflow-y-auto max-h-[300px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div 
                    onClick={() => {
                      setSelectedMonth('all');
                      setIsMonthOpen(false);
                    }}
                    className={`px-4 py-2 hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors text-sm font-medium ${selectedMonth === 'all' ? 'bg-primary/5 text-primary' : 'text-gray-600'}`}
                  >
                    Semua Bulan
                  </div>
                  {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map((month) => (
                    <div 
                      key={month}
                      onClick={() => {
                        setSelectedMonth(month);
                        setIsMonthOpen(false);
                      }}
                      className={`px-4 py-2 hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors text-sm font-medium ${selectedMonth === month ? 'bg-primary/5 text-primary' : 'text-gray-600'}`}
                    >
                      {new Date(2024, parseInt(month) - 1).toLocaleString('id-ID', { month: 'long' })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md shadow-primary/20 transition-all active:scale-95 ml-auto md:ml-0"
            >
              <FaDownload className="text-xs" /> Export CSV
            </button>
          </div>
        </div>

        {/* Dashboard Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner z-10"><FaMoneyBillWave /></div>
            <div className="z-10">
              <p className="text-gray-500 text-sm font-medium">Total Pendapatan</p>
              <h4 className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</h4>
            </div>
            <div className="absolute -right-8 -bottom-8 text-green-50 opacity-50"><FaMoneyBillWave size={120} /></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner z-10"><FaShoppingCart /></div>
            <div className="z-10">
              <p className="text-gray-500 text-sm font-medium">Pesanan Selesai</p>
              <h4 className="text-2xl font-bold text-gray-800">{totalOrders} Pesanan</h4>
            </div>
            <div className="absolute -right-8 -bottom-8 text-blue-50 opacity-50"><FaShoppingCart size={120} /></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner z-10"><FaChartLine /></div>
            <div className="z-10">
              <p className="text-gray-500 text-sm font-medium">Rata-Rata Transaksi</p>
              <h4 className="text-2xl font-bold text-gray-800">{formatCurrency(avgOrderValue)}</h4>
            </div>
            <div className="absolute -right-8 -bottom-8 text-purple-50 opacity-50"><FaChartLine size={120} /></div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaChartLine className="text-primary" /> Grafik Pendapatan {selectedMonth === 'all' ? 'Tahunan' : 'Bulanan'}
          </h3>
          <div className="h-[400px] w-full">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl animate-pulse text-gray-400">Memuat Grafik...</div>
            ) : chartData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl text-gray-400">Tidak ada data di periode ini</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(val) => `Rp${(val / 1000)}k`} />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [formatCurrency(Number(value) || 0), "Pendapatan"]}
                  />
                  <Bar dataKey="total" fill="var(--color-primary)" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>
    </>
  );
}