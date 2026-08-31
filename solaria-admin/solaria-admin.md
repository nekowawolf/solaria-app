# Solaria Admin Panel

Panel Admin untuk mengelola data menu, pesanan, dan analitik pada sistem Solaria. Dibangun menggunakan **Next.js 15** dengan **App Router** dan **TypeScript**.

## Struktur Folder

Berikut adalah penjelasan mengenai struktur folder di dalam `solaria-admin`:

- **`src/app/`**: Berisi rute utama aplikasi menggunakan Next.js App Router.
  - **`(dashboard)/`**: Folder grup untuk halaman-halaman dashboard (Add Menu, Analytics, Menu Management).
  - **`login/`**: Halaman login untuk admin.
  - **`layout.tsx` & `page.tsx`**: Layout utama dan halaman beranda dashboard.
- **`src/components/`**: Komponen UI yang dapat digunakan kembali.
  - **`common/`**: Komponen dasar seperti Button, Input, Modal, Table, dan Pagination.
  - **`layout/`**: Komponen struktur halaman seperti Header, Sidebar, dan Mobile Navigation.
  - **`menu/`**: Komponen spesifik untuk manajemen menu (seperti `MenuTable`).
  - **`orders/`**: Komponen spesifik untuk manajemen pesanan (`OrdersTable`).
  - **`scanner/`**: Komponen untuk fitur pemindaian barcode.
- **`src/hooks/`**: Custom React hooks untuk memisahkan logika bisnis dari komponen (contoh: `useMenus`, `useOrders`).
- **`src/services/`**: Logika komunikasi dengan API backend (`api.ts`, `menuService.ts`).
- **`src/styles/`**: File konfigurasi gaya global (Tailwind CSS).
- **`src/types/`**: Definisi tipe data TypeScript untuk konsistensi data di seluruh aplikasi.
- **`src/utils/`**: Fungsi pembantu (helper) seperti pemformatan mata uang dan perhitungan pajak.
- **`public/`**: Aset statis seperti gambar dan ikon.

## Fitur Utama

- Manajemen Menu (Tambah, Edit, Hapus).
- Monitoring Pesanan secara real-time.
- Analitik penjualan.
- Autentikasi Admin.
- Pemindaian Barcode untuk validasi pesanan.

## Teknologi

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Icons** (Icons)
- **Axios** (API Client)