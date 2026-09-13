# Ringkasan Fitur dan Alur Pemesanan Tiket

Dokumen ini merangkum pembahasan mengenai fitur backend, verifikasi pembayaran transfer, serta pemesanan tiket secara online dan offline.

## 1. Gambaran Sistem

Aplikasi adalah sistem pemesanan tiket konser yang memiliki dua jenis pengguna:

- **Admin**: mengelola event, artis, kategori tiket, pesanan, pembayaran, dan laporan.
- **Customer**: melihat event, memesan tiket, membayar, mengupload bukti pembayaran, dan melihat tiket.

Backend menggunakan REST API, Express.js, dan Supabase.

## 2. Fitur Backend yang Tersedia

### Autentikasi

- Register
- Login
- Mengambil profil user
- Forgot password
- Reset password
- Autentikasi menggunakan JWT
- Role `admin` dan `customer`

### Artis

- Melihat semua artis
- Melihat detail artis
- Admin menambah artis
- Admin mengubah artis
- Admin menghapus artis
- Upload foto artis

### Event

- Melihat semua event
- Melihat detail event
- Admin menambah event
- Admin mengubah event
- Admin menghapus event
- Upload poster event
- Status event `open` atau `closed`

### Kategori Tiket

- Melihat kategori tiket
- Melihat detail kategori tiket
- Admin menambah kategori tiket
- Admin mengubah kategori tiket
- Admin menghapus kategori tiket
- Mengatur harga, kuota, dan sisa tiket

### Order

- Customer membuat order
- Validasi jumlah dan stok tiket
- Reservasi stok tiket
- Generate kode order
- Order memiliki batas waktu pembayaran
- Customer melihat order miliknya
- Admin melihat seluruh order
- Filter order berdasarkan status
- Customer membatalkan order yang masih pending
- Order pending dapat expired secara otomatis

### Pembayaran

- Customer mengirim bukti pembayaran
- Admin melihat data pembayaran
- Admin menyetujui pembayaran
- Admin menolak pembayaran
- Status pembayaran: `pending`, `approved`, `rejected`
- Generate QR Code setelah pembayaran disetujui

### Dashboard Admin

- Total event
- Total artis
- Total order
- Total tiket terjual
- Total tiket tersisa
- Total pendapatan

## 3. Alur Pembayaran Online

1. Customer memilih event, kategori tiket, dan jumlah tiket.
2. Sistem mengecek apakah event masih `open` dan stok mencukupi.
3. Sistem membuat order dengan status `pending`.
4. Stok tiket masuk ke status `reserved`.
5. Customer melakukan transfer dalam batas waktu pembayaran.
6. Customer mengupload bukti transfer.
7. Payment dibuat dengan status `pending`.
8. Admin memeriksa nominal, rekening tujuan, tanggal, dan bukti transfer.
9. Admin mengambil keputusan:
   - **Approve**: payment menjadi `approved`, order menjadi `paid`, stok reserved menjadi tiket terjual, dan QR ticket dibuat.
   - **Reject**: payment menjadi `rejected`, order menjadi `rejected` atau `cancelled`, dan stok dikembalikan.
10. Customer dapat melihat status order dan tiketnya.

Alur singkat:

```text
Customer pilih tiket
        |
        v
Order pending + stok reserved
        |
        v
Transfer dan upload bukti
        |
        v
Admin memeriksa pembayaran
      /   \
     /     \
Approve   Reject
   |         |
   v         v
Paid      Rejected
   |         |
   v         v
QR ticket  Stok dikembalikan
```

## 4. Alur Pemesanan Offline

Pemesanan offline dilakukan oleh admin atau petugas loket menggunakan sistem yang sama.

1. Customer datang ke loket.
2. Petugas memilih customer atau memasukkan data customer baru.
3. Petugas memilih event, kategori tiket, dan jumlah tiket.
4. Sistem mengecek stok yang sama dengan penjualan online.
5. Petugas membuat order offline.
6. Customer membayar secara cash atau transfer di tempat.
7. Petugas mengonfirmasi pembayaran secara langsung.
8. Payment langsung dibuat sebagai `approved` jika uang sudah diterima.
9. Order langsung menjadi `paid`.
10. Stok tiket dikurangi dari persediaan.
11. Sistem membuat QR ticket atau tiket cetak.
12. Tiket diberikan kepada customer.

Alur singkat:

```text
Customer datang ke loket
        |
        v
Petugas input order
        |
        v
Sistem cek stok
        |
        v
Customer membayar
        |
        v
Petugas konfirmasi pembayaran
        |
        v
Order paid + stok berkurang
        |
        v
QR ticket atau tiket cetak diberikan
```

## 5. Perbedaan Online dan Offline

| Bagian | Online | Offline |
|---|---|---|
| Pembuat order | Customer | Admin atau petugas |
| Pembayaran | Transfer lalu upload bukti | Cash atau transfer langsung |
| Status awal | `pending` | Dapat langsung `paid` |
| Verifikasi | Dilakukan admin setelah memeriksa bukti | Dikonfirmasi petugas saat transaksi |
| Bukti pembayaran | File upload | Catatan metode pembayaran atau bukti internal |
| Tiket | QR/e-ticket | QR/e-ticket atau tiket cetak |

## 6. Endpoint Pembayaran Online yang Sudah Disiapkan

```http
POST /api/payments
```

Customer mengirim bukti pembayaran menggunakan multipart form-data.

```http
GET /api/payments/order/:orderId
```

Customer atau admin melihat pembayaran berdasarkan order.

```http
PATCH /api/payments/:id/verify
```

Admin menyetujui atau menolak pembayaran.

Body untuk menyetujui:

```json
{
  "status": "approved"
}
```

Body untuk menolak:

```json
{
  "status": "rejected"
}
```

## 7. Rekomendasi Struktur Data

Order sebaiknya memiliki informasi sumber pemesanan:

```text
order_source:
- online
- offline
```

Payment sebaiknya memiliki metode pembayaran:

```text
payment_method:
- bank_transfer
- cash
- e_wallet
```

Order offline sebaiknya mencatat admin atau petugas yang membuat transaksi:

```text
created_by: admin_id atau staff_id
```

Contoh order offline:

```json
{
  "user_id": 25,
  "created_by": 3,
  "order_source": "offline",
  "status": "paid",
  "total": 150000
}
```

Contoh payment offline:

```json
{
  "order_id": 100,
  "payment_method": "cash",
  "status": "approved",
  "verified_by": 3
}
```

## 8. Rekomendasi Endpoint Offline

Pemesanan offline sebaiknya memakai endpoint khusus admin atau petugas:

```http
POST /api/admin/orders/offline
```

Endpoint tersebut harus:

- Hanya bisa diakses admin atau petugas.
- Mengecek stok sebelum order dibuat.
- Menggunakan sumber stok yang sama dengan order online.
- Mencatat admin atau petugas yang melayani.
- Mencatat metode pembayaran.
- Dapat langsung membuat order `paid` setelah pembayaran diterima.
- Menghasilkan QR ticket atau tiket cetak.

## 9. Aturan Penting Sistem

- Online dan offline harus menggunakan stok yang sama.
- Payment tidak boleh diverifikasi dua kali.
- Order yang sudah expired tidak boleh dibayar atau disetujui.
- Approve payment, perubahan order, dan perubahan stok sebaiknya dilakukan dalam satu transaksi atau Supabase RPC.
- Penolakan pembayaran sebaiknya memiliki alasan.
- Sistem sebaiknya mencatat siapa admin yang melakukan verifikasi dan kapan dilakukan.
- Bukti pembayaran harus divalidasi tipe dan ukuran filenya.
- Bukti pembayaran sebaiknya disimpan pada storage private.
- Kolom `reserved` dan `expires_at` harus tersedia karena dipakai pada proses reservasi dan expiry order.

## 10. Referensi Teknis

- OWASP File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- Supabase Storage Access Control: https://supabase.com/docs/guides/storage/security/access-control
- Supabase Database Functions: https://supabase.com/docs/guides/database/functions
- Midtrans Payment Notification: https://docs.midtrans.com/docs/https-notification-webhooks
- Stripe PaymentIntents: https://docs.stripe.com/payments/payment-intents

## 11. Kesimpulan

Pola yang paling tepat adalah menggunakan satu sistem order dan satu sumber stok untuk transaksi online maupun offline.

Perbedaannya hanya pada pihak yang membuat order dan cara pembayaran:

- Online: customer membuat order, upload bukti transfer, lalu menunggu verifikasi admin.
- Offline: petugas membuat order, menerima pembayaran langsung, lalu mengonfirmasi order sebagai paid.

Dengan pola ini, data order, stok, pembayaran, dan tiket tetap konsisten meskipun transaksi dilakukan melalui dua jalur.
