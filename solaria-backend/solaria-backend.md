# Solaria Backend API

Backend API untuk sistem Solaria yang menangani logika bisnis, autentikasi, manajemen menu, dan pesanan. Dibangun menggunakan **Go (Golang)** dengan pendekatan yang terstruktur dan efisien.

## Struktur Folder

Berikut adalah penjelasan mengenai struktur folder di dalam `solaria-backend`:

- **`config/`**: Berisi konfigurasi aplikasi, termasuk koneksi database (`database.go`).
- **`controllers/`**: Menangani permintaan HTTP (request) dan memberikan respon.
  - **`authController.go`**: Logika autentikasi admin.
  - **`menuController.go`**: CRUD menu.
  - **`orderController.go`**: Manajemen pesanan.
  - **`websocketController.go`**: Menangani koneksi real-time via WebSocket.
- **`database/`**:
  - **`migrations/`**: Berisi file SQL (`init.sql`) untuk inisialisasi struktur database.
- **`middleware/`**: Fungsi yang berjalan sebelum request mencapai controller.
  - **`auth.go`**: Validasi token JWT.
  - **`cors.go`**: Pengaturan Cross-Origin Resource Sharing.
- **`models/`**: Definisi struktur data (struct) yang mewakili entitas di database.
  - **`admin.go`**, **`menu.go`**, **`order.go`**.
- **`routes/`**: Definisi endpoint API dan menghubungkannya dengan controller yang sesuai.
- **`utils/`**: Fungsi pembantu umum.
  - **`jwt.go`**: Logika pembuatan dan verifikasi token JWT.
  - **`response.go`**: Helper untuk format respon API yang konsisten.
- **`main.go`**: Entry point utama aplikasi.

## Fitur Utama

- RESTful API untuk manajemen menu dan pesanan.
- Autentikasi menggunakan JWT (JSON Web Token).
- Notifikasi pesanan real-time menggunakan WebSocket.
- Manajemen database menggunakan PostgreSQL/MySQL (sesuai konfigurasi).
- Middleware untuk keamanan dan CORS.

## Teknologi

- **Go (Golang)**
- **GORM** (ORM untuk interaksi database)
- **JWT Go** (Autentikasi)
- **Gorilla WebSocket** (Komunikasi real-time)
- **Godotenv** (Manajemen file .env)