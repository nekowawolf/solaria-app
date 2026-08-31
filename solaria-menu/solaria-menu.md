# Solaria Customer Menu

Aplikasi Menu Pelanggan untuk sistem Solaria. Pelanggan dapat melihat menu, menambahkan item ke keranjang, dan melakukan pemesanan secara mandiri. Dibangun menggunakan **Next.js 15** dengan fokus pada performa dan pengalaman pengguna.

## Struktur Folder

Berikut adalah penjelasan mengenai struktur folder di dalam `solaria-menu`:

- **`src/app/`**: Rute utama aplikasi menggunakan Next.js App Router.
  - **`cart/`**: Halaman keranjang belanja.
  - **`orders/`**: Halaman riwayat atau status pesanan saat ini.
  - **`summary/`**: Halaman ringkasan sebelum atau sesudah pesanan dikirim.
  - **`layout.tsx` & `page.tsx`**: Layout utama dan halaman utama (Daftar Menu).
- **`src/components/`**: Komponen UI yang dapat digunakan kembali untuk antarmuka pelanggan.
  - **`BottomNav.tsx`**: Navigasi bawah untuk akses cepat (Home, Cart, Orders).
  - **`MenuCard.tsx`**: Tampilan kartu menu individual.
  - **`CartItem.tsx`**: Item menu di dalam keranjang.
  - **`CategoryTabs.tsx`**: Navigasi kategori menu.
  - **`QuantityButton.tsx`**: Komponen pengubah jumlah pesanan.
- **`src/data/`**: Berisi data statis atau mock data untuk pengembangan (`menu.ts`).
- **`src/hooks/`**: Custom hooks untuk manajemen logika aplikasi.
  - **`useCart.tsx`**: Mengelola status keranjang (Context/State).
- **`src/services/`**: Logika pengambilan data menu dari backend (`menuService.ts`).
- **`src/styles/`**: File konfigurasi gaya global (Tailwind CSS).
- **`src/types/`**: Definisi tipe data TypeScript untuk menu dan pesanan.
- **`src/utils/`**: Fungsi pembantu seperti `generateCode.ts` untuk pembuatan ID pesanan unik.
- **`public/`**: Aset statis seperti gambar dan ikon.

## Fitur Utama

- Browsing menu berdasarkan kategori.
- Manajemen Keranjang Belanja (Tambah/Kurang item).
- Checkout pesanan mandiri.
- Ringkasan pesanan yang detail.
- Antarmuka responsif yang ramah pengguna seluler (Mobile-first).

## Teknologi

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Icons)
- **Context API** (State Management untuk Keranjang)