# Panduan Langkah 4: Frontend Vue 3 Setup & Auth Flow (Pinia & Router Guard)

Dokumen ini memuat dokumentasi arsitektur **Frontend Vue 3** dan alur autentikasi (Login, Register, Session Store, & Route Protection) pada aplikasi **Personal Job Application Tracker**.

---

## 1. Arsitektur Modular Frontend

Mengikuti prinsip modular yang konsisten dengan backend:

```text
frontend/src/
├── core/                                   # Shared Foundation / Infrastructure
│   ├── api/
│   │   └── api.client.ts                   # Axios Singleton + Bearer Interceptor + 401 Handler
│   ├── layouts/
│   │   └── AppLayout.vue                   # Header Topbar, User Profile Badge, Tombol Logout
│   ├── router/
│   │   └── index.ts                        # Vue Router 4 + Navigation Guards
│   └── types/
│       └── auth.types.ts                   # DTO & Interface Frontend (User, ApiResponse, dll)
│
├── modules/
│   ├── auth/                               # Modul Autentikasi Pengguna
│   │   ├── services/
│   │   │   └── auth.api.ts                 # Service Pemanggil API Auth
│   │   ├── stores/
│   │   │   └── auth.store.ts               # Pinia Store (Login, Register, Logout, Token)
│   │   └── views/
│   │       ├── LoginView.vue               # Halaman Form Login Pelamar
│   │       └── RegisterView.vue            # Halaman Form Registrasi Akun
│   │
│   └── dashboard/                          # Modul Dashboard Utama
│       └── views/
│           └── DashboardView.vue           # Ringkasan Metrik & Status Akun
│
├── App.vue                                 # Root Component (<RouterView />)
├── main.ts                                 # App Bootstrap (Vue + Pinia + Router)
└── style.css                               # Tailwind CSS Entry
```

---

## 2. Cara Kerja Proteksi Rute (Navigation Guards)

Setiap perpindahan halaman dipantau oleh `router.beforeEach`:
1. **Rute Terproteksi (`requiresAuth: true`):**
   - Rute seperti `/dashboard`, `/jobs`, `/kanban`.
   - Jika pengguna belum memiliki token aktif di Pinia / `localStorage`, sistem otomatis me-redirect ke `/login` disertai query parameter `?redirect=...`.
2. **Rute Khusus Tamu (`guestOnly: true`):**
   - Halaman `/login` dan `/register`.
   - Jika pengguna sudah login, sistem otomatis mengalihkan ke `/dashboard` sehingga tidak perlu login ulang.
3. **Axios Interceptor Otomatis:**
   - Menyematkan header `Authorization: Bearer <token>` pada setiap request ke backend.
   - Jika server mengembalikan respon `401 Unauthorized` (misal token kedaluwarsa), sesi lokal langsung dibersihkan dan pengguna diarahkan ke halaman login.

---

## 3. Akun Pengujian yang Siap Digunakan

Anda dapat langsung mencoba login di browser:
- **URL:** [http://localhost:5173/login](http://localhost:5173/login)
- **Email:** `dimas@test.com`
- **Password:** `password123`
- *(Atau buat akun baru melalui link **Daftar sekarang** di halaman login).*

---

## 4. Alur Selanjutnya: Langkah 5

Dengan tersedianya sesi autentikasi dan token yang valid, kita siap membangun:
1. **Kanban Board Lamaran Interaktif** (Kolom: *Wishlist, Terkirim, Tes, Wawancara HR, Wawancara User, Offering, Accepted/Rejected*).
2. **Formulir Input Loker Cepat** (Paste link loker, nama PT, posisi, gaji, tipe kerja).
3. **Modal Jadwal Interview** (Input tanggal/jam dan link Google Meet/Zoom).

