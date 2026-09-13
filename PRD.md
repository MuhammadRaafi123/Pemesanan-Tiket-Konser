# PRD (Product Requirements Document)
# Aplikasi Pemesanan Tiket Konser Berbasis Web & Mobile

**Version:** 1.0  
**Status:** Draft  
**Project Type:** Web Admin + Mobile App (Customer)  
**Backend:** REST API  
**Database:** Supabase
**Author:** -

---

# 1. Project Overview

Aplikasi Pemesanan Tiket Konser adalah sistem yang digunakan untuk membantu penyelenggara konser dalam mengelola event, tiket, dan transaksi pembelian secara digital.

Sistem terdiri dari dua platform:

- **Web Admin**
  Digunakan oleh penyelenggara untuk mengelola seluruh data konser, tiket, artis, dan pesanan.

- **Mobile App**
  Digunakan oleh pelanggan untuk melihat konser, memesan tiket, melakukan pembayaran, dan melihat riwayat pembelian.

Semua data tersimpan pada database dan diakses melalui REST API.

---

# 2. Goals

## Business Goals

- Mempermudah proses penjualan tiket konser.
- Mengurangi penjualan tiket secara manual.
- Menghindari overbooking tiket.
- Mempermudah admin memonitor penjualan tiket.
- Mempercepat proses verifikasi pembayaran.

---

## User Goals

### Admin

- Mengelola data konser dengan mudah.
- Mengatur jumlah tiket setiap kategori.
- Melihat seluruh transaksi.
- Memverifikasi pembayaran pelanggan.
- Mengetahui jumlah tiket yang telah terjual.

### Customer

- Melihat daftar konser.
- Memilih kelas tiket.
- Melakukan pemesanan tiket.
- Melihat status pesanan.
- Menyimpan riwayat pembelian.

---

# 3. User Roles

## Admin

Hak akses:

- Login
- Mengelola Event
- Mengelola Artis
- Mengelola Kategori Tiket
- Mengelola Kuota Tiket
- Melihat Pesanan
- Verifikasi Pembayaran
- Menutup Penjualan Tiket
- Dashboard Penjualan

---

## Customer

Hak akses:

- Register
- Login
- Melihat Konser
- Melihat Detail Konser
- Memesan Tiket
- Upload Bukti Pembayaran
- Melihat Riwayat Pesanan
- Melihat QR Ticket (Opsional)

---

# 4. Features

---

# A. Web Admin

## 1. Login

### Deskripsi

Admin melakukan autentikasi sebelum masuk dashboard.

### Input

- Email
- Password

### Output

Dashboard Admin

---

## 2. Dashboard

Menampilkan:

- Total Event
- Total Artis
- Total Pesanan
- Tiket Terjual
- Tiket Tersisa
- Grafik Penjualan

---

## 3. CRUD Event

Admin dapat:

- Tambah Event
- Edit Event
- Hapus Event
- Melihat daftar Event

Data Event:

- Nama Event
- Deskripsi
- Lokasi
- Tanggal
- Jam
- Poster
- Status Event

---

## 4. CRUD Penyanyi / Artis

Data:

- Nama Artis
- Foto
- Deskripsi

---

## 5. CRUD Kategori Tiket

Contoh:

- VIP
- Festival
- Tribune
- Gold
- Silver

Data:

- Nama Kategori
- Harga
- Kuota
- Sisa Tiket

---

## 6. Daftar Pesanan

Menampilkan:

- Nama Customer
- Event
- Kategori
- Jumlah Tiket
- Total Harga
- Status Pembayaran

---

## 7. Verifikasi Pembayaran

Admin dapat:

- Approve
- Reject

Status:

- Pending
- Paid
- Cancelled

---

## 8. Monitoring Kuota Tiket

Admin dapat melihat:

- Total Tiket
- Tiket Terjual
- Tiket Tersisa

Per kategori.

---

## 9. Menutup Penjualan Tiket

Admin dapat mengubah status:

- Open
- Closed

Jika Closed maka customer tidak bisa membeli tiket.

---

# B. Mobile Customer

---

## 1. Register

Input:

- Nama
- Email
- Password
- No HP

---

## 2. Login

Input:

- Email
- Password

---

## 3. Home

Menampilkan:

- Banner
- Event Terbaru
- Event Terpopuler

---

## 4. Daftar Konser

Informasi:

- Poster
- Nama Event
- Lokasi
- Tanggal
- Harga Mulai

---

## 5. Detail Konser

Menampilkan:

- Poster
- Deskripsi
- Lokasi
- Artis
- Jadwal
- Harga Tiket
- Kuota

---

## 6. Pilih Kategori Tiket

Customer memilih:

- VIP
- Festival
- Tribune

Menentukan jumlah tiket.

---

## 7. Checkout

Menampilkan:

- Ringkasan Pesanan
- Total Harga
- Metode Pembayaran

Upload:

- Bukti Transfer

---

## 8. Riwayat Pesanan

Menampilkan:

- Nomor Pesanan
- Event
- Status
- Total
- Tanggal

---

## 9. QR Ticket (Bonus)

Jika pembayaran sudah diverifikasi maka QR Code muncul.

QR digunakan saat check-in konser.

---

# 5. User Flow

## Admin Flow

```text
Login
    ↓
Dashboard
    ↓
Kelola Event
    ↓
Kelola Artis
    ↓
Kelola Tiket
    ↓
Lihat Pesanan
    ↓
Verifikasi Pembayaran
    ↓
Update Kuota
    ↓
Close Penjualan
```

---

## Customer Flow

```text
Register/Login
        ↓
Home
        ↓
Daftar Event
        ↓
Detail Event
        ↓
Pilih Tiket
        ↓
Checkout
        ↓
Upload Bukti Bayar
        ↓
Menunggu Verifikasi
        ↓
Pembayaran Disetujui
        ↓
QR Ticket / Riwayat
```

---

# 6. UI/UX

## Web Admin

### Login

- Form sederhana
- Email
- Password

---

### Dashboard

Card:

- Total Event
- Total Tiket
- Tiket Terjual
- Pendapatan

Grafik:

- Penjualan Tiket

Sidebar:

- Dashboard
- Event
- Artis
- Tiket
- Pesanan
- Logout

---

### Event Management

Table

- Poster
- Nama
- Lokasi
- Tanggal
- Status
- Action

Action

- Edit
- Delete

---

### Ticket Category

Table

- Nama
- Harga
- Kuota
- Terjual
- Sisa

---

### Order List

Table

- Customer
- Event
- Tiket
- Status
- Action

---

## Mobile

### Splash Screen

↓

Login/Register

↓

Home

↓

Detail Event

↓

Pilih Tiket

↓

Checkout

↓

Riwayat

↓

Profile

---

### Design Style

- Modern
- Minimalist
- Material Design
- Dominan warna hitam dan emas
- Responsive
- Bottom Navigation

Bottom Navigation:

- Home
- Ticket
- History
- Profile

---

# 7. Database Overview

## Tabel Users

| Field | Type |
|---------|------|
| id | bigint |
| name | varchar |
| email | varchar |
| password | varchar |
| role | enum(admin,customer) |

---

## Tabel Artists

| Field | Type |
|---------|------|
| id | bigint |
| name | varchar |
| photo | varchar |
| description | text |

---

## Tabel Events

| Field | Type |
|---------|------|
| id | bigint |
| artist_id | FK |
| title | varchar |
| description | text |
| location | varchar |
| event_date | datetime |
| poster | varchar |
| status | enum(open,closed) |

---

## Tabel Ticket Categories

| Field | Type |
|---------|------|
| id | bigint |
| event_id | FK |
| category_name | varchar |
| price | decimal |
| quota | integer |
| remaining | integer |

---

## Tabel Orders

| Field | Type |
|---------|------|
| id | bigint |
| user_id | FK |
| order_code | varchar |
| total | decimal |
| status | enum(pending,paid,rejected,cancelled) |
| created_at | datetime |

---

## Tabel Order Items

| Field | Type |
|---------|------|
| id | bigint |
| order_id | FK |
| ticket_category_id | FK |
| qty | integer |
| subtotal | decimal |

---

## Tabel Payments

| Field | Type |
|---------|------|
| id | bigint |
| order_id | FK |
| payment_method | varchar |
| proof_image | varchar |
| status | enum(pending,approved,rejected) |
| verified_at | datetime |

---

## Relasi Database

```text
Users
   │
   └──────────────┐
                  │
              Orders
                  │
          Order Items
                  │
        Ticket Categories
                  │
              Events
                  │
              Artists

Orders
    │
Payments
```

---

# 8. Technical Requirements

## Frontend Web

- React.js / Vue.js
- Bootstrap / Tailwind CSS
- Axios
- React Router

---

## Mobile

- Flutter

atau

- React Native

---

## Backend

- Laravel
- Express.js
- Spring Boot

(Memilih salah satu)

---

## Database

- Supabase

---

## API

REST API

Endpoint utama:

```
POST   /login
POST   /register

GET    /events
GET    /events/{id}

POST   /orders
GET    /orders

POST   /payments

GET    /ticket-categories

POST   /admin/events
PUT    /admin/events/{id}
DELETE /admin/events/{id}

POST   /admin/artists

POST   /admin/ticket-categories

GET    /admin/orders

PUT    /admin/payments/{id}

GET    /admin/dashboard
```

---

## Authentication

- JWT Token / Laravel Sanctum
- Password Hashing (bcrypt)

---

## Validation

Semua input wajib divalidasi.

Contoh:

- Email unik
- Password minimal 8 karakter
- Harga > 0
- Kuota > 0
- Jumlah tiket tidak boleh melebihi stok
- File bukti pembayaran hanya JPG/PNG/PDF
- Ukuran file maksimal 2 MB

---

## Security

- Authentication
- Authorization (Role Admin & Customer)
- SQL Injection Protection (ORM)
- XSS Protection
- CSRF Protection (Web)
- HTTPS
- Input Validation

---

# 9. Scope Project

## In Scope

### Admin

- Login
- Dashboard
- CRUD Event
- CRUD Artis
- CRUD Kategori Tiket
- Daftar Pesanan
- Verifikasi Pembayaran
- Monitoring Kuota Tiket
- Menutup Penjualan Tiket

### Customer

- Register
- Login
- Daftar Event
- Detail Event
- Pilih Tiket
- Checkout
- Upload Bukti Pembayaran
- Riwayat Pesanan
- QR Ticket (Bonus)

### Backend

- REST API
- Database
- Authentication
- Authorization
- Validasi Input
- CRUD API
- Upload File

---

## Out of Scope

Fitur berikut tidak termasuk dalam versi pertama (MVP):

- Pembayaran otomatis melalui Payment Gateway (Midtrans/Xendit)
- Refund tiket
- Scan QR Code saat check-in
- Notifikasi Email
- Notifikasi Push
- Live Chat
- Multi bahasa
- Wishlist Event
- Promo & Voucher
- Rating dan Review Event
- Integrasi Google Maps
- Integrasi Kalender
- Multi Organizer
- Analitik lanjutan dan laporan keuangan
- Sistem check-in offline
- Integrasi media sosial

---

# 10. Success Metrics

- Admin dapat mengelola seluruh data konser tanpa error.
- Customer dapat menyelesaikan proses pemesanan tiket hingga pembayaran.
- Kuota tiket berkurang secara otomatis setelah pembayaran diverifikasi.
- Dashboard menampilkan data penjualan secara real-time.
- Seluruh data tersimpan dengan aman di database.
- Validasi input mencegah data tidak valid masuk ke sistem.
- REST API memiliki response yang konsisten dan terdokumentasi.